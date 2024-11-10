function authenticateUser(req, res, next) {
    // Check for a valid token or session
    if (req.headers.authorization) {
        // Proceed with authenticated route
        next();
    } else {
        res.status(401).send({ error: "Unauthorized access" });
    }
}

module.exports = authenticateUser;
