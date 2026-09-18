const express = require("express");

const router = express.Router();

const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint
} = require("../complaintController");


// ================= CREATE COMPLAINT =================

router.post("/", createComplaint);


// ================= GET ALL USER COMPLAINTS =================

router.get("/", getComplaints);


// ================= GET SINGLE COMPLAINT =================

router.get("/:id", getComplaintById);


// ================= UPDATE COMPLAINT =================

router.put("/:id", updateComplaint);


// ================= DELETE COMPLAINT =================

router.delete("/:id", deleteComplaint);


module.exports = router;
