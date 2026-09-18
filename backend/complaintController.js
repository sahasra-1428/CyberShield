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
