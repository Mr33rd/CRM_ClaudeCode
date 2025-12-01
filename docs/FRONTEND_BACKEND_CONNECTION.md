# Frontend ↔️ Backend Connection Guide

This guide shows you exactly how the React frontend connects to the Express backend in the MAD Journey CRM system.

## 🔌 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                           │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │         React Frontend (localhost:3000)          │      │
│  │                                                   │      │
│  │  • Login Page                                    │      │
│  │  • Student Dashboard                             │      │
│  │  • Admin Dashboard                               │      │
│  │  • API Service (api.js)                         │      │
│  └──────────────────────────────────────────────────┘      │
│                          ↕                                   │
│                   HTTP Requests                             │
│                   (with JWT Token)                          │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│              Express Backend (localhost:5000)                │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │              API Routes                          │      │
│  │  /api/auth/login                                 │      │
│  │  /api/dashboard/student                          │      │
│  │  /api/students                                   │      │
│  │  /api/belts                                      │      │
│  │  /api/payments                                   │      │
│  └──────────────────────────────────────────────────┘      │
│                          ↕                                   │
│  ┌──────────────────────────────────────────────────┐      │
│  │          PostgreSQL Database                     │      │
│  │  • users                                         │      │
│  │  • students                                      │      │
│  │  • belt_progressions                             │      │
│  │  • payments                                      │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Step-by-Step: Running Both Together

### Step 1: Start the Backend

```bash
# Terminal 1
cd backend
npm install          # First time only
npm run dev
```

You should see:
```
✓ Database connection established
Server running on port 5000
API URL: http://localhost:5000/api
```

### Step 2: Start the Frontend

```bash
# Terminal 2 (new terminal window)
cd frontend
npm install          # First time only
npm start
```

Browser opens automatically at `http://localhost:3000`

### Step 3: Test the Connection

1. Open browser at `http://localhost:3000`
2. You'll see the login page
3. Click "Admin" demo button
4. Click "Login"
5. **What happens behind the scenes:**

```javascript
// Frontend: User clicks Login
// → src/pages/Login.js

handleSubmit() {
  const result = await login(email, password);
  // Calls AuthContext login function
}

// → src/contexts/AuthContext.js

login(email, password) {
  const response = await authAPI.login(email, password);
  // Calls API service
}

// → src/services/api.js

authAPI.login(email, password) {
  return api.post('/auth/login', { email, password });
  // Sends HTTP POST to backend
}

// HTTP Request:
// POST http://localhost:5000/api/auth/login
// Body: { "email": "admin@...", "password": "..." }

// Backend receives:
// → backend/src/routes/authRoutes.js
// → backend/src/controllers/authController.js

// Backend responds:
// { "success": true, "data": { "token": "jwt...", "user": {...} } }

// Frontend receives token, stores in localStorage
// User is redirected to dashboard
```

## 📡 How API Calls Work

### Example: Loading Student Dashboard

**Frontend Code:**
```javascript
// src/pages/StudentDashboard.js

useEffect(() => {
  loadDashboard();
}, []);

const loadDashboard = async () => {
  const response = await dashboardAPI.getStudent();
  setData(response.data.data);
};
```

**API Service:**
```javascript
// src/services/api.js

export const dashboardAPI = {
  getStudent: () => api.get('/dashboard/student')
};

// api.get() automatically:
// 1. Adds base URL: http://localhost:5000/api
// 2. Adds auth token from localStorage
// 3. Sets headers: Authorization: Bearer jwt_token_here
```

**HTTP Request Sent:**
```
GET http://localhost:5000/api/dashboard/student
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

**Backend Processes:**
```javascript
// backend/src/routes/dashboardRoutes.js
router.get('/student', authenticate, authorize('student'), getStudentDashboard);

// backend/src/middleware/auth.js - Verifies JWT token
// backend/src/controllers/dashboardController.js - Gets data from database
```

**Backend Response:**
```json
{
  "success": true,
  "data": {
    "studentInfo": { ... },
    "progress": { ... },
    "payments": { ... },
    "upcomingSessions": [ ... ]
  }
}
```

**Frontend Updates:**
```javascript
// React re-renders with new data
setData(response.data.data);
// Dashboard displays student information
```

## 🔐 Authentication Flow

### 1. User Logs In

```
Frontend                          Backend
   |                                 |
   | POST /api/auth/login           |
   |  { email, password }           |
   |------------------------------->|
   |                                |
   |                            Verify
   |                          credentials
   |                                |
   |  { token, user }               |
   |<-------------------------------|
   |                                |
Store token in
localStorage
   |
Redirect to
dashboard
```

### 2. Protected API Calls

```
Frontend                          Backend
   |                                 |
   | GET /api/dashboard/student     |
   | Authorization: Bearer token    |
   |------------------------------->|
   |                                |
   |                           Verify
   |                            token
   |                                |
   |                        Get data from
   |                          database
   |                                |
   |  { success: true, data: {...} }|
   |<-------------------------------|
   |                                |
Update UI with
   data
```

### 3. Token Expiration

```
Frontend                          Backend
   |                                 |
   | GET /api/some-endpoint         |
   | Authorization: Bearer old_token|
   |------------------------------->|
   |                                |
   |                           Token
   |                          expired!
   |                                |
   |  401 Unauthorized              |
   |<-------------------------------|
   |                                |
Clear token
Redirect to
  /login
```

## 🛠️ Configuration Files

### Frontend `.env`

```env
# Tells frontend where backend is
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend `.env`

```env
# Backend port
PORT=5000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# JWT secret for token generation
JWT_SECRET=your_secret_key
```

### Backend CORS Configuration

```javascript
// backend/src/server.js

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// This allows frontend at localhost:3000 to make requests
```

## 🔍 Debugging Connection Issues

### Issue: "Network Error"

**Check:**
1. Is backend running? `cd backend && npm run dev`
2. Is it on port 5000? Check terminal output
3. Is frontend pointing to correct URL? Check `.env`

**Fix:**
```bash
# Backend terminal should show:
Server running on port 5000

# Frontend .env should have:
REACT_APP_API_URL=http://localhost:5000/api
```

### Issue: "CORS Error"

**Error in browser console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**
Check backend `src/server.js` has:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: "401 Unauthorized"

**Causes:**
1. Not logged in
2. Token expired
3. Invalid token

**Check:**
- Open browser DevTools → Application → Local Storage
- Look for `token` key
- If missing or invalid, log in again

### Issue: "Cannot GET /api/dashboard/student"

**Cause:** Frontend sending request to wrong endpoint

**Check:**
- Frontend `.env`: `REACT_APP_API_URL=http://localhost:5000/api`
- Network tab in DevTools shows correct URL

## 📊 Data Flow Example: Award Belt

Let's trace a complete flow from button click to database update:

**1. Instructor clicks "Award Yellow Belt"**

```javascript
// Frontend: src/pages/InstructorDashboard.js

const awardBelt = async (studentId) => {
  await beltAPI.awardBelt(studentId, {
    beltLevel: 'yellow',
    testScore: 85,
    testPassed: true
  });
};
```

**2. API Service sends HTTP request**

```javascript
// src/services/api.js

export const beltAPI = {
  awardBelt: (studentId, data) =>
    api.post(`/belts/award/${studentId}`, data)
};

// Sends:
// POST http://localhost:5000/api/belts/award/student-uuid-here
// Headers: Authorization: Bearer jwt_token
// Body: { beltLevel: 'yellow', testScore: 85, testPassed: true }
```

**3. Backend receives and processes**

```javascript
// backend/src/routes/beltRoutes.js
router.post('/award/:studentId', authenticate, authorize('instructor'), awardBelt);

// backend/src/controllers/beltController.js
const awardBelt = async (req, res) => {
  const { studentId } = req.params;
  const { beltLevel, testScore, testPassed } = req.body;

  // Create belt progression record
  const progression = await BeltProgression.create({
    studentId,
    beltLevel,
    testScore,
    testPassed,
    instructorId: req.user.id
  });

  // Update student's current belt
  await Student.update(
    { currentBeltLevel: beltLevel },
    { where: { id: studentId } }
  );

  res.json({ success: true, data: progression });
};
```

**4. Database updated**

```sql
-- PostgreSQL executes:

INSERT INTO belt_progressions (
  student_id, belt_level, test_score,
  test_passed, instructor_id
) VALUES (...);

UPDATE students
SET current_belt_level = 'yellow'
WHERE id = 'student-uuid';
```

**5. Backend responds**

```json
{
  "success": true,
  "data": {
    "id": "progression-uuid",
    "studentId": "student-uuid",
    "beltLevel": "yellow",
    "testScore": 85,
    "testPassed": true
  }
}
```

**6. Frontend updates UI**

```javascript
// React re-fetches student data
// Dashboard shows new yellow belt
// Success message displayed
```

## 🎯 Summary

**Frontend (React)**
- Runs on `localhost:3000`
- Makes HTTP requests to backend
- Stores JWT token in localStorage
- Displays data received from backend

**Backend (Express)**
- Runs on `localhost:5000`
- Provides REST API endpoints
- Verifies JWT tokens
- Queries PostgreSQL database
- Returns JSON responses

**Connection**
- Frontend calls backend via `http://localhost:5000/api/*`
- Backend allows requests from `localhost:3000` (CORS)
- JWT token authenticates every request
- Data flows: Frontend → Backend → Database → Backend → Frontend

---

**You're all set! Both systems work together seamlessly.** 🎯
