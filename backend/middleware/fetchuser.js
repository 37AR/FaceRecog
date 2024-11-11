const jwt = require('jsonwebtoken');
const JWT_SECRET = "Iam$Batman";

const fetchuser = (req, res, next) => {
    // getting user from JWT token & add ID to req object
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({ error: "Please authenticate using a Valid token" })
    }
    try {
        const data = jwt.verify(token , JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a Valid token" })
    }
};

module.exports = fetchuser;