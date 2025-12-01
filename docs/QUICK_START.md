# Quick Start Guide - MAD Journey CRM

Get your MAD Journey CRM up and running in 5 minutes!

## Prerequisites

Make sure you have:
- Node.js installed (v16 or higher)
- PostgreSQL installed and running
- A terminal/command prompt

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Database

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE mad_journey_crm;

# Exit PostgreSQL
\q
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

**IMPORTANT**: Edit `.env` and update these values:

```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_random_secret_key
```

To generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Initialize Database

```bash
npm run init-db
```

### 5. Add Sample Data (Optional)

```bash
npm run seed
```

This creates test accounts:
- Admin: `admin@trenttactical.com` / `admin123`
- Instructor: `instructor@trenttactical.com` / `instructor123`
- Students: `student1@example.com` / `student123`, etc.

### 6. Start the Server

```bash
npm run dev
```

You should see:
```
🎯 MAD JOURNEY CRM - API SERVER
Server running on port 5000
```

## Test It Out!

### 1. Health Check

Open your browser and go to:
```
http://localhost:5000/health
```

You should see: `{"status":"OK","message":"MAD Journey CRM API is running"}`

### 2. Login (Using Postman, Insomnia, or cURL)

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@trenttactical.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@trenttactical.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Admin Dashboard

Use the token from step 2:

```bash
curl http://localhost:5000/api/dashboard/admin \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## What's Next?

### For Development:
1. Explore the API endpoints in `README.md`
2. Check out the full documentation in `docs/SETUP_GUIDE.md`
3. Modify the code to fit your needs
4. Build a frontend application

### For Production:
1. Change JWT_SECRET to a strong random value
2. Set NODE_ENV=production
3. Use a strong database password
4. Set up HTTPS/SSL
5. Configure email and SMS services
6. Deploy to a cloud server

## Common Issues

### "Unable to connect to database"
- Make sure PostgreSQL is running
- Check your database credentials in `.env`
- Verify the database exists: `psql -l`

### "Port 5000 already in use"
- Change PORT in `.env` to a different port
- Or kill the process: `lsof -i :5000` then `kill -9 <PID>`

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` folder and run `npm install`

## Support

Need help? Check:
- Full README.md
- SETUP_GUIDE.md
- Or contact: support@trenttacticalservices.com

---

**You're ready to go! 🎯**
