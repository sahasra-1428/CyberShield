const express = require("express");

const router = express.Router();

const authMiddleware = require("../authMiddleware");

const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint
} = require("../complaintController");

// ================= CREATE COMPLAINT =================

router.post(
    "/",
    authMiddleware,
    createComplaint
);

// ================= GET USER COMPLAINTS =================

router.get(
    "/",
    authMiddleware,
    getComplaints
);

// ================= GET SINGLE COMPLAINT =================

router.get(
    "/:id",
    authMiddleware,
    getComplaintById
);

// ================= UPDATE COMPLAINT =================

router.put(
    "/:id",
    authMiddleware,
    updateComplaint
);

// ================= DELETE COMPLAINT =================

router.delete(
    "/:id",
    authMiddleware,
    deleteComplaint
);

module.exports = router;
