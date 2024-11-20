const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const FaceData = require('../models/FaceData');


// ROUTE 1: Register Face data using: POST "api/face/register-face". Login required
router.post('/register-face', fetchuser,
    async(req, res) => {
        try{
            const { faceEncoding, label } = req.body;

            if(!faceEncoding || !label){
                return res.status(400).json({ error: "faceEncoding and label are required!" });
            }

            // creating a FaceData document to upload in mongoDB
            const faceData = new FaceData({
                user: req.user.id,
                label: label,
                faceEncoding: faceEncoding,
            });
            await faceData.save();
            res.status(200).json({ success: true, message: "Face data saved successfully" });
        }
        catch(error) {
            console.error("Error in /register-face route: ", error);
            res.status(500).json({ success: false, message: "Server error occurred!" });
        }
    }
);


// ROUTE 2: Get Face data using: GET "api/face/getfacedata". Login required

router.get('/getfacedata', fetchuser, 
    async(req, res) => {
        try {
            const faceData = await FaceData.find({ user: req.user.id });
            res.json(faceData);
        } catch (error) {
            res.status(500).send("Sorry, server error occured!");
        }
});




module.exports = router;