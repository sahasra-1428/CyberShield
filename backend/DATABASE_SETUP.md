# CyberShield Backend - Database Setup Guide

## 📋 Prerequisites
- MySQL Server installed and running
- Node.js installed
- npm installed

## 🗄️ Database Setup

### Option 1: Automatic (Recommended)
The backend will automatically create all tables when the server starts for the first time.

### Option 2: Manual SQL Setup
1. Open MySQL Workbench or MySQL CLI
2. Run the `database.sql` file:
   ```bash
   mysql -u root -p < database.sql
   ```
3. Or paste the contents of `database.sql` into MySQL directly

## 🔧 Configuration

### Step 1: Update .env File
Edit `backend/.env` with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=cybershield

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production

# Node Environment
NODE_ENV=development
```

### Step 2: Install Dependencies
```bash
cd backend
npm install
```

### Step 3: Start the Server
```bash
npm start
```

You should see:
```
✅ MySQL connected successfully
✅ Users table created/exists successfully
✅ Complaints table created/exists successfully
✅ Contact messages table created/exists successfully
```

## 📊 Database Tables

### 1. **users** Table
- `id` - Primary Key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password (bcrypt)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### 2. **complaints** Table
- `id` - Primary Key
- `userId` - Foreign Key (users table)
- `title` - Complaint title
- `description` - Complaint details
- `category` - Complaint category
- `status` - Status (pending, resolved, rejected)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### 3. **contact_messages** Table
- `id` - Primary Key
- `name` - Sender name
- `email` - Sender email
- `subject` - Message subject
- `message` - Message content
- `status` - Status (unread, read)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## 🔌 API Endpoints

### Authentication Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Complaint Endpoints (Protected - requires JWT)
- `POST /api/complaints` - Create complaint
- `GET /api/complaints` - Get user's complaints
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Contact Endpoints
- `POST /api/contact` - Send contact message (public)
- `GET /api/contact` - Get all messages (protected)
- `GET /api/contact/:id` - Get single message
- `DELETE /api/contact/:id` - Delete message (protected)

## ⚠️ Troubleshooting

### MySQL Connection Error
- Check if MySQL service is running
- Verify credentials in `.env`
- Ensure database name matches

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using the port

### Permission Denied
- Check folder permissions
- Run with appropriate user privileges

## 🔒 Security Notes
- Change `JWT_SECRET` in `.env` for production
- Use strong MySQL passwords
- Never commit `.env` file to git
- Use HTTPS in production

## 📝 Example API Calls

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Complaint (with JWT token)
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Phishing Attempt",
    "description": "Received suspicious email...",
    "category": "phishing",
    "status": "pending"
  }'
```

## ✅ Verification
Test the connection at: `http://localhost:5000/api/test`

Should return:
```json
{
  "success": true,
  "message": "CyberShield API connected successfully"
}
```
