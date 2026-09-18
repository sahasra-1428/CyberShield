const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

require("./db");

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


// ================= AUTH ROUTES =================

app.use("/api/auth", authRoutes);


// ================= COMPLAINT ROUTES =================

app.use("/api/complaints", complaintRoutes);


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
