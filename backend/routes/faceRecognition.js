const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const FaceData = require('../models/FaceData');
const PTM_FaceData = require('../models/PTM_FaceData');
const { model } = require('mongoose');


// ROUTE 1: Register Face data using: POST "api/face/register-face". Login required
router.post('/register-face', fetchuser, async (req, res) => {
    try {
        const { faceEncoding, label } = req.body;

        if (!faceEncoding || !label) {
            return res.status(400).json({ error: "faceEncoding and label are required!" });
        }

        // console.log("Received data:", req.body);

        // Fetch the existing face data for the user and label
        let existingFaceData = await FaceData.findOne({ user: req.user.id, label: label });

        // If no existing face data, create a new document with the provided encoding
        if (!existingFaceData) {
            const faceData = new FaceData({
                user: req.user.id,
                label: label,
                faceEncoding: faceEncoding,
            });
            await faceData.save();
            return res.status(200).json({ success: true, message: "Face data saved successfully" });
        }

        // If face data exists, compute the average of the embeddings
        const existingEncoding = existingFaceData.faceEncoding;
        const updatedEncoding = existingEncoding.map((value, index) => {
            // Calculate the new average for each dimension
            return (value + faceEncoding[index]) / 2;
        });

        // Update the face data document with the new averaged encoding
        existingFaceData.faceEncoding = updatedEncoding;
        await existingFaceData.save();

        res.status(200).json({ success: true, message: "Face data updated with averaged encoding" });
    } catch (error) {
        console.error("Error in /register-face route: ", error);
        res.status(500).json({ success: false, message: "Server error occurred!" });
    }
});




// ROUTE 2: Verify Face using: POST "api/face/authenticate". Login required
router.post('/verify-face', fetchuser, async (req, res) => {
    try {
        const { embedding } = req.body; // Receiving embedding from frontend
        console.log("Received embedding from Frontend");
        // console.log("Received Embedding:", embedding);

        if (!embedding || embedding.length === 0) {
            return res.status(400).json({ error: "Embedding is required for authentication" });
        }

        // Step 1: Fetch all stored embeddings for the logged-in user
        const storedFaces = await FaceData.find({ user: req.user.id });

        if (storedFaces.length === 0) {
            return res.status(404).json({ message: "No registered faces found for authentication" });
        }

        // Step 2: Compare the received embedding with stored embeddings
        let bestMatch = null;
        let minDistance = Infinity;

        for (const face of storedFaces) {
            const storedEmbedding = face.faceEncoding;

            if (embedding.length !== storedEmbedding.length) {
                console.error(`Mismatched lengths: received=${embedding.length}, stored=${storedEmbedding.length}`);
                continue; // Skip this face
            }

            // Calculate distance only if lengths match
            const distance = Math.sqrt(
                embedding.reduce((sum, value, idx) => sum + Math.pow(value - storedEmbedding[idx], 2), 0)
            );
            console.log(`Distance to ${face.label}: ${distance}`);

            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = face;
            }
        }

        // Step 3: Decide match threshold (adjust this based on testing)
        const threshold = 0.6; // Set an appropriate threshold based on your model's performance
        if (minDistance <= threshold && bestMatch) {
            return res.status(200).json({
                message: "Person identified successfully",
                name: bestMatch.label,
                details: bestMatch, // Include any other stored details
            });
        } else {
            return res.status(200).json({ message: "No match found" });
        }
    } catch (error) {
        console.error("Error during authentication:", error.message);
        res.status(500).send("Internal Server Error");
    }
});



// ROUTE 3: Delete a face label from profile: DELETE "/api/face/delete-labels/:label". Login required
router.delete('/delete-labels/:label', fetchuser, async (req, res) => {
    try {
        const label = req.params.label;
        const modelType = req.query['model-type'];
        console.log('DELETE request received for label:', label, 'ModelType: ', modelType);

        if (!label || !modelType) {
            return res.status(400).json({ error: 'Label & ModelType parameters are required' });
        }

        if(modelType==='CNN') {
            result = await FaceData.deleteOne({ user: req.user.id, label });
        } else if (modelType==='PTM') {
            result = await PTM_FaceData.deleteOne({ user: req.user.id, label });
        } else {
            return res.status(400).json({ error: 'Invalid Model Type'});
        }
        
        console.log('Delete operation result:', result);

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Label not found or already deleted' });
        }

        res.json({ message: 'Label removed successfully' });
    } catch (error) {
        console.error('Error deleting label:', error.message);
        res.status(500).json({ error: 'An internal server error occurred while deleting the label' });
    }
});


// ROUTE 4: Register Face data using: POST "api/face/register-face-ptm". Login required
router.post('/register-face-ptm', fetchuser, async (req, res) => {
    try {
        const { faceEncoding, label } = req.body;

        if (!faceEncoding || !label) {
            return res.status(400).json({ error: "faceEncoding and label are required!" });
        }

        // console.log("Received data:", req.body);

        // Fetch the existing face data for the user and label
        let existingPTMFaceData = await PTM_FaceData.findOne({ user: req.user.id, label: label });

        // If no existing face data, create a new document with the provided encoding
        if (!existingPTMFaceData) {
            const PTM_faceData = new PTM_FaceData({
                user: req.user.id,
                label: label,
                faceEncoding: faceEncoding,
            });
            await PTM_faceData.save();
            return res.status(200).json({ success: true, message: "Face data saved successfully" });
        }

        // If face data exists, compute the average of the embeddings
        const existingEncoding = existingPTMFaceData.faceEncoding;
        const updatedEncoding = existingEncoding.map((value, index) => {
            // Calculate the new average for each dimension
            return (value + faceEncoding[index]) / 2;
        });

        // Update the face data document with the new averaged encoding
        existingPTMFaceData.faceEncoding = updatedEncoding;
        await existingPTMFaceData.save();

        res.status(200).json({ success: true, message: "Face data updated with averaged encoding" });
    } catch (error) {
        console.error("Error in /register-face route: ", error);
        res.status(500).json({ success: false, message: "Server error occurred!" });
    }
});


module.exports = router;