const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

require("./db");

const app = express();

app.use(
    cors({
        origin: "https://cyber-shield-gamma-nine.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CyberShield Backend is running"
    });
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "CyberShield API connected successfully"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

app.use((err, req, res, next) => {
    console.error("❌ Server error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 CyberShield Backend running on port ${PORT}`);
});
