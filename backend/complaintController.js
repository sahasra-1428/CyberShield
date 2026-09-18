const pool = require("./db");

// ================= CREATE COMPLAINT =================

exports.createComplaint = async (req, res) => {
    try {
        const {
            title,
            description,
            category
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, description and category are required"
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO complaints
            (userId, title, description, category)
            VALUES (?, ?, ?, ?)`,
            [
                req.user.id,
                title,
                description,
                category
            ]
        );

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaintId: result.insertId
        });

    } catch (error) {
        console.error("Create complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit complaint"
        });
    }
};
const express = require("express");

const router = express.Router();

const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint
} = require("../complaintController");

// Create complaint
router.post("/", createComplaint);

// Get all complaints of logged-in user
router.get("/", getComplaints);

// Get single complaint
router.get("/:id", getComplaintById);

// Update complaint
router.put("/:id", updateComplaint);

// Delete complaint
router.delete("/:id", deleteComplaint);

module.exports = router;
