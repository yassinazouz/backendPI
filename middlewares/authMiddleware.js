const jwt = require('jsonwebtoken');
require('dotenv').config();

async function authMiddleware(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).send({ error: "Invalid or expired token." });
    }
}


async function RoleauthMiddleware(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.Role === "admin") {
            req.user = decoded;
            next();
        } else {
            return res.status(403).send({ error: "Access denied. Admin privileges required." });
        }
    } catch (err) {
        console.error(err);
        return res.status(403).send({ error: "Invalid or expired token." });
    }
}


module.exports = { authMiddleware, RoleauthMiddleware };
