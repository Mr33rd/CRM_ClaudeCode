# MAD Journey CRM - Setup Guide

This guide will help you get the MAD Journey CRM system up and running on your local machine or server.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [PostgreSQL Setup](#postgresql-setup)
3. [Backend Setup](#backend-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Initialization](#database-initialization)
6. [Running the Application](#running-the-application)
7. [Testing the API](#testing-the-api)
8. [Troubleshooting](#troubleshooting)

## System Requirements

- **Node.js**: v16.x or higher
- **PostgreSQL**: v12.x or higher
- **npm**: v7.x or higher (comes with Node.js)
- **Operating System**: Linux, macOS, or Windows

## PostgreSQL Setup

### On Ubuntu/Debian Linux

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user
sudo -i -u postgres

# Create database and user
psql
```

In the PostgreSQL prompt:

```sql
CREATE DATABASE mad_journey_crm;
CREATE USER mad_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mad_journey_crm TO mad_user;
\q
```

### On macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb mad_journey_crm
```

### On Windows

1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Use pgAdmin to create the `mad_journey_crm` database

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js
- Sequelize (ORM)
- PostgreSQL driver
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for emails
- And more...

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mad_journey_crm
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (Optional - for notifications)
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@trenttacticalservices.com

# Twilio SMS Configuration (Optional - for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Important Notes on Environment Variables:

1. **JWT_SECRET**: Generate a strong random string. You can use:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Email Configuration**:
   - For Gmail, you need to create an App Password (not your regular password)
   - Go to Google Account → Security → 2-Step Verification → App Passwords

3. **Twilio SMS** (Optional):
   - Sign up at https://www.twilio.com
   - Get your Account SID and Auth Token from the dashboard

## Database Initialization

### 1. Initialize Database Tables

```bash
npm run init-db
```

This command will:
- Create all database tables
- Set up relationships between tables
- Prepare the database structure

Expected output:
```
🔄 Initializing database...
✓ Database connection has been established successfully.
🔄 Synchronizing database models...
✓ Database models synchronized successfully!
✓ Database initialization completed successfully!
```

### 2. Seed Sample Data (Optional but Recommended)

```bash
npm run seed
```

This will create:
- Admin user
- Instructor user
- 3 sample students (different progression levels)
- Sample sessions
- Sample assessments
- Sample payments

Sample credentials after seeding:
```
Admin:      admin@trenttactical.com / admin123
Instructor: instructor@trenttactical.com / instructor123
Student 1:  student1@example.com / student123
Student 2:  student2@example.com / student123
Student 3:  student3@example.com / student123
```

## Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port you specified in .env)

You should see:

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎯 MAD JOURNEY CRM - API SERVER                        ║
║                                                           ║
║   Mindset • Accuracy • Discipline                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Server running on port 5000
Environment: development
API URL: http://localhost:5000/api
```

## Testing the API

### Using cURL

#### 1. Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "MAD Journey CRM API is running",
  "timestamp": "2024-12-01T12:00:00.000Z"
}
```

#### 2. Register a New Student

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstudent@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-15",
    "address": "123 Main St",
    "city": "Phoenix",
    "state": "AZ",
    "zipCode": "85001",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1234567891",
    "emergencyContactRelationship": "Spouse"
  }'
```

#### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@trenttactical.com",
    "password": "admin123"
  }'
```

Save the token from the response for authenticated requests.

#### 4. Get Profile (Authenticated)

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman or Insomnia

1. Import the API collection (if available)
2. Set the base URL to `http://localhost:5000/api`
3. Use the token from login in the Authorization header

## Troubleshooting

### Database Connection Issues

**Problem**: `Unable to connect to the database`

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql  # Linux
   brew services list                 # macOS
   ```

2. Check database credentials in `.env` file

3. Test database connection:
   ```bash
   psql -U your_db_user -d mad_journey_crm
   ```

### Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::5000`

**Solutions**:
1. Change PORT in `.env` file to a different port (e.g., 5001)
2. Kill the process using port 5000:
   ```bash
   # Find process
   lsof -i :5000

   # Kill process
   kill -9 <PID>
   ```

### Missing Dependencies

**Problem**: `Cannot find module 'xyz'`

**Solution**:
```bash
npm install
```

### Email/SMS Not Working

**Problem**: Notifications not sending

**Solution**:
- These features are optional
- The system will log a message and continue without sending
- Check your email/Twilio credentials in `.env`
- Check console logs for specific error messages

### Database Sync Errors

**Problem**: `SequelizeDatabaseError: relation already exists`

**Solution**:
1. Drop and recreate the database:
   ```sql
   DROP DATABASE mad_journey_crm;
   CREATE DATABASE mad_journey_crm;
   ```

2. Re-run initialization:
   ```bash
   npm run init-db
   ```

## Next Steps

1. **Customize the System**: Modify models, controllers, or add new features
2. **Set Up Frontend**: Create React frontend application
3. **Deploy to Production**: Set up on a cloud server (AWS, DigitalOcean, etc.)
4. **Configure SSL**: Set up HTTPS for production
5. **Set Up Backup**: Configure database backups
6. **Configure Monitoring**: Set up application monitoring and logging

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Use a strong database password
- [ ] Enable SSL/HTTPS
- [ ] Set up proper CORS configuration
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring and alerts
- [ ] Review and test all security features
- [ ] Set up email service (SendGrid, AWS SES, etc.)
- [ ] Configure SMS service (Twilio)

## Support

For issues or questions:
- Check the main README.md
- Review API documentation
- Contact: support@trenttacticalservices.com

---

**Happy Coding! 🎯**
