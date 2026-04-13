const { loginUser, registerUser } = require("../services/auth.service");

// ── LOGIN ──
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await loginUser(email, password);

        // ✅ Set httpOnly cookie — browser stores it automatically
        res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000
});

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: { user } // ✅ no token in response body — it's in the cookie
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
};

// ── REGISTER ──
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const { user } = await registerUser(name, email, password);

        return res.status(201).json({
            success: true,
            message: "Account created successfully! Please login.",
            data: { user }
        });
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
};

// ── LOGOUT ──
const logout = async (req, res) => {
    try {
        // ✅ Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message || "Logout failed"
        });
    }
};

module.exports = { login, register, logout };
