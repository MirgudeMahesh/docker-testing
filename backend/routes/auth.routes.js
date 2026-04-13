const express = require("express");
const router = express.Router();

const { login, register, logout } = require("../controllers/auth.controller");
const { validateLogin, validateRegister } = require("../middlewares/validate.middleware");
const { authMiddleware } = require("../middlewares/auth.middleware");

// POST /api/auth/login
router.post("/login", validateLogin, login);

// POST /api/auth/register
router.post("/register", validateRegister, register);

// POST /api/auth/logout (protected route)
router.post("/logout", authMiddleware, logout);

module.exports = router;
