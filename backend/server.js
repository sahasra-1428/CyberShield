const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const pool = require("./db");

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());


// ================= HOME =================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CyberShield Backend is running"
    });
});


// ================= API TEST =================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "CyberShield API connected successfully"
    });
});


// ================= DEBUG ROUTES =================

app.get("/api/debug/users", async (req, res) => {
    try {
        const [users] = await pool.execute("SELECT name, email FROM users");

        res.json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error("❌ Debug users error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// ================= AUTH ROUTES =================

app.use("/api/auth", authRoutes);


// ================= COMPLAINT ROUTES =================

app.use("/api/complaints", complaintRoutes);


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
