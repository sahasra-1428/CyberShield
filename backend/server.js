const express = require("express");
const cors = require("cors");
require("dotenv").config();


// ==========================================
// IMPORT ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");


// ==========================================
// DATABASE CONNECTION
// ==========================================

require("./db");


// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

// Allow requests from your Vercel frontend
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


// Read JSON request body
app.use(express.json());


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "CyberShield Backend is running"
    });

});


// ==========================================
// API TEST ROUTE
// ==========================================

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "CyberShield API connected successfully"
    });

});


// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
//
// Signup:
// POST /api/auth/signup
//
// Login:
// POST /api/auth/login
//

app.use(
    "/api/auth",
    authRoutes
);


// ==========================================
// COMPLAINT / REPORT ROUTES
// ==========================================
//
// Create report:
// POST /api/complaints
//
// Get reports:
// GET /api/complaints
//
// Get one report:
// GET /api/complaints/:id
//
// Update report:
// PUT /api/complaints/:id
//
// Delete report:
// DELETE /api/complaints/:id
//

app.use(
    "/api/complaints",
    complaintRoutes
);


// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    console.error("❌ Server error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});


// ==========================================
// START SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `🚀 CyberShield Backend running on port ${PORT}`
        );

    }
);
