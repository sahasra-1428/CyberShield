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

router.post(
    "/",
    authMiddleware,
    createComplaint
);

router.get(
    "/",
    authMiddleware,
    getComplaints
);

router.get(
    "/:id",
    authMiddleware,
    getComplaintById
);

router.put(
    "/:id",
    authMiddleware,
    updateComplaint
);

router.delete(
    "/:id",
    authMiddleware,
    deleteComplaint
);

module.exports = router;
