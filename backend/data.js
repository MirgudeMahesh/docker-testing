require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// ── CORS Configuration ──
// Allow React frontend running on localhost:3000
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     credentials: true,  // ✅ required for cookies
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// ── Middleware ──



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
    res.json({ message: "API working ✅" });
});
// ── Health Check ──
app.get("/", (req, res) => {
    res.json({ 
        success: true, 
        message: "🚀 Server is running",
        timestamp: new Date().toISOString()
    });
});

// ── 404 Handler ──
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// ── Error Handler (must be last) ──
app.use(errorHandler);

// ── Start Server ──
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📱 Frontend connected from: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});