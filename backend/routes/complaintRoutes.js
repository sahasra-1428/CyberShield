const express = require("express");

const router = express.Router();

const {
    submitComplaint
} = require("../complaintController");

router.post("/", submitComplaint);

module.exports = router;
