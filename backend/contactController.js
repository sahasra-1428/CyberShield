const db = require("../config/db");

// ================= SEND CONTACT MESSAGE =================
exports.sendMessage = (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const query = "INSERT INTO contact_messages (name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, NOW())";
        db.query(query, [name, email, subject, message], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error sending message",
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: "Message sent successfully",
                messageId: result.insertId
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ================= GET ALL MESSAGES (Admin) =================
exports.getAllMessages = (req, res) => {
    try {
        const query = "SELECT * FROM contact_messages ORDER BY createdAt DESC";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error fetching messages",
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                messages: result
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ================= GET SINGLE MESSAGE =================
exports.getMessageById = (req, res) => {
    try {
        const { id } = req.params;

        const query = "SELECT * FROM contact_messages WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error fetching message",
                    error: err
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: result[0]
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// ================= DELETE MESSAGE =================
exports.deleteMessage = (req, res) => {
    try {
        const { id } = req.params;

        const query = "DELETE FROM contact_messages WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error deleting message",
                    error: err
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Message not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Message deleted successfully"
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
