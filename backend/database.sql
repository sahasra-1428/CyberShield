

CREATE DATABASE IF NOT EXISTS cybercrime_db;

USE cybercrime_db;



CREATE TABLE IF NOT EXISTS users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    phone VARCHAR(15),

    password VARCHAR(255) NOT NULL,

    role ENUM('user', 'admin') DEFAULT 'user',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


-- =========================================================
-- 2. COMPLAINTS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS complaints (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    crime_type VARCHAR(100) NOT NULL,

    description TEXT NOT NULL,

    incident_date DATE,

    amount DECIMAL(12,2) DEFAULT 0,

    evidence VARCHAR(255),

    status ENUM(
        'Pending',
        'Under Investigation',
        'Resolved',
        'Rejected'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_complaint_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);


-- =========================================================
-- 3. CONTACTS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS contacts (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


-- =========================================================
-- 4. CHECK TABLES
-- =========================================================

SHOW TABLES;


-- =========================================================
-- 5. CHECK USERS TABLE
-- =========================================================

DESCRIBE users;


-- =========================================================
-- 6. CHECK COMPLAINTS TABLE
-- =========================================================

DESCRIBE complaints;


-- =========================================================
-- 7. CHECK CONTACTS TABLE
-- =========================================================

DESCRIBE contacts;


-- =========================================================
-- 8. CHECK USERS DATA
-- =========================================================

SELECT
    id,
    name,
    email,
    phone,
    role,
    created_at
FROM users;


-- =========================================================
-- 9. CHECK COMPLAINTS DATA
-- =========================================================

SELECT
    id,
    user_id,
    crime_type,
    description,
    incident_date,
    amount,
    evidence,
    status,
    created_at
FROM complaints;


-- =========================================================
-- 10. CHECK CONTACT DATA
-- =========================================================

SELECT
    id,
    name,
    email,
    message,
    created_at
FROM contacts;

