const jwt = require('jsonwebtoken');
require('dotenv').config();

const authmiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log("No token found");
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Middleware decoded user:", decoded);
        next();
    } catch (error) {
        console.log("Token verification failed:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};

module.exports = authmiddleware;
