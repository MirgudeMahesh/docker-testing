const { verifyToken } = require("../utils/jwt.util");

// ── Protect Routes - Verify JWT from Cookie ──
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login first."
            });
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again."
        });
    }
};

module.exports = { authMiddleware };
