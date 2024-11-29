const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const FaceData = require('../models/FaceData');
const PTM_FaceData = require('../models/PTM_FaceData');

const JWT_SECRET = "Iam$Batman";

// ROUTE 1: create a User using: POST "api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must contain atleast 5 characters').isLength({ min: 5 }),
], async (req, res)=> {
    let success = false;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
    
        try {
        // Check whether the user with this email exists already
            let user = await User.findOne({ email: req.body.email });
            // console.log(user)  
            if (user) {
                return res.status(400).json({ success, error: "Sorry, a user with this email already exists" })
            }
    
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            // create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });
    
            const data = {
               user:{
                id: user.id
               } 
            }
            const authToken = jwt.sign(data, JWT_SECRET);
    
            // res.json(user);
            success = true;
            res.json({success, authToken});
    
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some Error occured");
        }
})


// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {

    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({email});
        if(!user) {
            // success = false;
            return res.status(400).json({success, error: "Please try to login with correct credentials."});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            // success = false;
            return res.status(400).json({ success, error: "Please try to login with correct credentials." });
        }

        const data = {
            user:{
             id: user.id
            } 
         }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });

    } catch(error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 3: Get User Profile using: GET "/api/auth/profile". Login required
router.get('/profile', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Avoid returning sensitive info
        const faceData = await FaceData.find({ user: req.user.id }).select('label -_id');
        const labels = faceData.map((data) => data.label);
        const PTM_faceData = await PTM_FaceData.find({ user: req.user.id }).select('label -_id');
        const plabels = PTM_faceData.map((data) => data.label);

        res.json({ user, labels, plabels });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profile data' });
    }
});


// ROUTE 4: Update user's name from profile: PUT "/api/auth/profile/update-name". Login required

router.put('/profile/update-name', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id; // `auth` middleware should add `user` to req
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name cannot be empty.' });
        }

        // Find user and update the name
        const user = await User.findByIdAndUpdate(
            userId,
            { name },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'Name updated successfully.', user });
    } catch (error) {
        console.error('Error updating name:', error.message);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});


module.exports = router;