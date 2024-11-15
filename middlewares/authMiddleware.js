const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateUser(req, res, next) {
    // Check for a valid token or session
    if (req.headers.authorization) {
        // Proceed with authenticated route
        next();
    } else {
        res.status(401).send({ error: "Unauthorized access" });
    }
}

function authMiddleware(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the Bearer token

    if (!token) {
        return res.status(401).send({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user data to the request
        next();
    } catch (err) {
        res.status(403).send({ error: "Invalid or expired token." });
    }
}


module.exports = {authMiddleware , authenticateUser};
