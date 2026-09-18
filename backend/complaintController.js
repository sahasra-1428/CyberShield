const pool = require("../config/db");

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


// ================= GET USER COMPLAINTS =================

exports.getComplaints = async (req, res) => {
    try {

        const [complaints] = await pool.execute(
            `SELECT
                id,
                title,
                description,
                category,
                status,
                createdAt,
                updatedAt
             FROM complaints
             WHERE userId = ?
             ORDER BY createdAt DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            complaints
        });

    } catch (error) {

        console.error("Get complaints error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch complaints"
        });
    }
};


// ================= GET SINGLE COMPLAINT =================

exports.getComplaintById = async (req, res) => {
    try {

        const { id } = req.params;

        const [complaints] = await pool.execute(
            `SELECT
                id,
                title,
                description,
                category,
                status,
                createdAt,
                updatedAt
             FROM complaints
             WHERE id = ?
             AND userId = ?`,
            [
                id,
                req.user.id
            ]
        );

        if (complaints.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.json({
            success: true,
            complaint: complaints[0]
        });

    } catch (error) {

        console.error("Get complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch complaint"
        });
    }
};


// ================= UPDATE COMPLAINT =================

exports.updateComplaint = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            title,
            description,
            category
        } = req.body;

        const [result] = await pool.execute(
            `UPDATE complaints
             SET
                title = ?,
                description = ?,
                category = ?
             WHERE id = ?
             AND userId = ?`,
            [
                title,
                description,
                category,
                id,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.json({
            success: true,
            message: "Complaint updated successfully"
        });

    } catch (error) {

        console.error("Update complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update complaint"
        });
    }
};


// ================= DELETE COMPLAINT =================

exports.deleteComplaint = async (req, res) => {
    try {

        const { id } = req.params;

        const [result] = await pool.execute(
            `DELETE FROM complaints
             WHERE id = ?
             AND userId = ?`,
            [
                id,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.json({
            success: true,
            message: "Complaint deleted successfully"
        });

    } catch (error) {

        console.error("Delete complaint error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete complaint"
        });
    }
};