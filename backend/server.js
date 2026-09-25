const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

require("./db");

const app = express();


// =====================================================
// CORS
// =====================================================

app.use(
    cors({
        origin: [
            "https://cyber-shield-gamma-nine.vercel.app"
        ],
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// =====================================================
// JSON BODY
// =====================================================

app.use(express.json());


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CyberShield Backend is running"
    });
});


// =====================================================
// TEST API
// =====================================================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "CyberShield API connected successfully"
    });
});


// =====================================================
// AUTH ROUTES
// =====================================================

app.use("/api/auth", authRoutes);


// =====================================================
// COMPLAINT / REPORT ROUTES
// =====================================================

app.use("/api/complaints", complaintRoutes);


// =====================================================
// 404
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error("❌ Server error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});


// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 CyberShield Backend running on port ${PORT}`
    );
});
