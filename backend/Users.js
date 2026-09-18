const db = require("../config/db");

// ================= CREATE USERS TABLE =================
const createUsersTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    db.query(query, (err) => {
        if (err) {
            console.error("❌ Error creating users table:", err);
        } else {
            console.log("✅ Users table created/exists successfully");
        }
    });
};

// ================= USER MODEL METHODS =================

const User = {
    // Create a new user
    create: (userData, callback) => {
        const query = "INSERT INTO users SET ?";
        db.query(query, userData, callback);
    },

    // Find user by email
    findByEmail: (email, callback) => {
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query, [email], callback);
    },

    // Find user by ID
    findById: (id, callback) => {
        const query = "SELECT * FROM users WHERE id = ?";
        db.query(query, [id], callback);
    },

    // Update user
    update: (id, userData, callback) => {
        const query = "UPDATE users SET ? WHERE id = ?";
        db.query(query, [userData, id], callback);
    },

    // Delete user
    delete: (id, callback) => {
        const query = "DELETE FROM users WHERE id = ?";
        db.query(query, [id], callback);
    },

    // Get all users
    getAll: (callback) => {
        const query = "SELECT * FROM users";
        db.query(query, callback);
    }
};

// Initialize table on app start
createUsersTable();

module.exports = User;
