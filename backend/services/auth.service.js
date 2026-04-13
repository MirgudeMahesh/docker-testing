const bcrypt = require("bcrypt");
const db = require("../db");
const { signToken } = require("../utils/jwt.util");

// ── LOGIN ──
const loginUser = async (email, password) => {
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (rows.length === 0) {
        throw { status: 401, message: "Invalid email or password" };
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw { status: 401, message: "Invalid email or password" };
    }

    const token = signToken({
        id: user.id,
        email: user.email,
        name: user.name
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
        }
    };
};

// ── REGISTER ──
const registerUser = async (name, email, password) => {
    // 1. Check if email already exists
    const [existing] = await db.execute(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (existing.length > 0) {
        throw { status: 409, message: "Email already registered. Please login." };
    }

    // 2. Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // 3. Insert new user into DB
    const [result] = await db.execute(
        "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, NOW())",
        [name, email, password_hash]
    );

    const newUserId = result.insertId;

    // 4. Return safe user object (no token on register — user must login)
    return {
        user: {
            id: newUserId,
            name,
            email
        }
    };
};

module.exports = { loginUser, registerUser };
