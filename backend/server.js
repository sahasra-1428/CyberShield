const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
const aiRoutes = require("./routes/ai");

app.use("/api/ai", aiRoutes);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
