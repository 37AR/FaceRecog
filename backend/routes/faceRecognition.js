const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const FaceData = require('../models/FaceData');


// ROUTE 1: Add Face data using: POST "api/face/addfacedata". Login required
router.post('/addfacedata', fetchuser,
    async(req, res) => {
        try{
            const { faceEncoding, label } = req.body;
            const faceData = new FaceData({
                user: req.user.id,
                faceEncoding,
                label
            });
            await faceData.save();
            res.send('Face data saved successfully');
        }
        catch(error) {
            res.status(500).send("Sorry, server error occured!");
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