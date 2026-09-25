const pool = require("./db");


// CREATE COMPLAINT
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

        return res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaintId: result.insertId
        });

    } catch (error) {

        console.error(
            "❌ Create complaint error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET USER COMPLAINTS
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

        return res.json({
            success: true,
            complaints: complaints
        });

    } catch (error) {

        console.error(
            "❌ Get complaints error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET SINGLE COMPLAINT
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

        return res.json({
            success: true,
            complaint: complaints[0]
        });

    } catch (error) {

        console.error(
            "❌ Get complaint error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE COMPLAINT
exports.updateComplaint = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            title,
            description,
            category
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

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

        return res.json({
            success: true,
            message: "Complaint updated successfully"
        });

    } catch (error) {

        console.error(
            "❌ Update complaint error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE COMPLAINT
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

        return res.json({
            success: true,
            message: "Complaint deleted successfully"
        });

    } catch (error) {

        console.error(
            "❌ Delete complaint error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
