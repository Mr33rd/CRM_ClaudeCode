# MAD Journey CRM - Frontend

React-based frontend application for the MAD Journey Firearm Training CRM system.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

The `.env` file is already created and configured to connect to your backend at `http://localhost:5000/api`.

If you need to change the backend URL:

```env
REACT_APP_API_URL=http://your-backend-url/api
```

### 3. Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🔌 How Frontend Connects to Backend

### API Service Layer

The frontend connects to your Express backend through the `src/services/api.js` file:

```javascript
import { authAPI, studentAPI, dashboardAPI } from './services/api';

// Login example
const result = await authAPI.login(email, password);

// Get student dashboard
const dashboard = await dashboardAPI.getStudent();
```

### Authentication Flow

1. **User logs in** → Frontend sends credentials to `/api/auth/login`
2. **Backend validates** → Returns JWT token
3. **Frontend stores token** → localStorage
4. **All subsequent requests** → Include token in Authorization header
5. **Backend verifies token** → Returns protected data

### API Endpoints Used

All endpoints are defined in `src/services/api.js`:

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Student registration
- `GET /api/auth/profile` - Get user profile

**Dashboards:**
- `GET /api/dashboard/student` - Student dashboard data
- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/instructor` - Instructor dashboard data

**Students:**
- `GET /api/students` - Get all students
- `GET /api/students/:id/progress` - Get student progress
- `GET /api/students/:id/attendance` - Get attendance history

**Belts:**
- `GET /api/belts/student/:studentId` - Get belt progressions
- `POST /api/belts/award/:studentId` - Award belt
- `GET /api/belts/curriculum/:beltLevel` - Get curriculum

**Payments:**
- `GET /api/payments/student/:studentId` - Get payments
- `PUT /api/payments/:id/record` - Record payment

**Sessions:**
- `GET /api/sessions/upcoming` - Get upcoming sessions
- `POST /api/sessions` - Create session

**And more...**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.js   # Authentication state management
│   ├── pages/               # Page components
│   │   ├── Login.js         # Login page
│   │   ├── StudentDashboard.js
│   │   └── AdminDashboard.js
│   ├── services/            # API service layer
│   │   └── api.js           # Backend API calls
│   ├── styles/              # CSS stylesheets
│   │   ├── App.css
│   │   ├── Login.css
│   │   └── Dashboard.css
│   ├── App.js               # Main app component with routing
│   └── index.js             # React entry point
├── public/
│   └── index.html           # HTML template
├── package.json             # Dependencies
├── .env                     # Environment variables
└── README.md                # This file
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. **Login Process:**
   - User enters credentials
   - Frontend sends to `/api/auth/login`
   - Backend verifies and returns token
   - Frontend stores token in localStorage
   - User is redirected to appropriate dashboard

2. **Protected Routes:**
   - All routes (except login) require authentication
   - Token is automatically added to all API requests
   - If token expires, user is redirected to login

3. **Role-Based Access:**
   - **Students** → `/dashboard` (Student Dashboard)
   - **Instructors** → `/instructor` (Instructor Dashboard)
   - **Admins** → `/admin` (Admin Dashboard)
   - **Staff** → Limited access to specific features

## 🎨 Features

### Student Dashboard
- View current belt level and progress
- Track payment status
- See upcoming training sessions
- Review recent assessments
- Check graduation status

### Admin Dashboard
- Overall system statistics
- Revenue tracking
- Student enrollment analytics
- Belt distribution overview
- Payment management
- Session oversight

### Instructor Dashboard
- Student roster
- Upcoming sessions
- Assessment tools
- Coaching notes
- Performance analytics

## 🧪 Testing Accounts

After running the backend seed script, use these credentials:

```
Admin:
  Email: admin@trenttactical.com
  Password: admin123

Instructor:
  Email: instructor@trenttactical.com
  Password: instructor123

Student:
  Email: student1@example.com
  Password: student123
```

## 🔄 How Data Flows

```
User Action (Frontend)
    ↓
API Call (api.js)
    ↓
HTTP Request → Backend (Express)
    ↓
Database Query (PostgreSQL)
    ↓
HTTP Response ← Backend
    ↓
Update UI (React State)
    ↓
User Sees Updated Data
```

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start development server (port 3000)
npm run build      # Build for production
npm test           # Run tests
```

### Adding New Features

1. **New API Endpoint:**
   - Add to `src/services/api.js`
   - Create function that calls the endpoint

2. **New Page:**
   - Create component in `src/pages/`
   - Add route in `src/App.js`
   - Add navigation link

3. **Protected Route:**
   - Wrap with `<PrivateRoute roles={['admin', 'instructor']}>` in App.js

## 🔌 Backend Connection Troubleshooting

### Connection Refused Error

If you see "Network Error" or "ECONNREFUSED":

1. **Check backend is running:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify backend URL in `.env`:**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Check CORS settings in backend:**
   Backend should allow `http://localhost:3000` in CORS config

### Token Expiration

If you're randomly logged out:
- Check JWT_EXPIRE setting in backend `.env`
- Default is 7 days

### API Errors

Check browser console (F12) for detailed error messages. Common issues:
- 401: Unauthorized (login again)
- 403: Forbidden (insufficient permissions)
- 404: Endpoint not found (check API URL)
- 500: Server error (check backend logs)

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy Options

1. **Netlify / Vercel:** Connect GitHub repo, auto-deploy
2. **AWS S3 + CloudFront:** Upload build folder
3. **Heroku:** Use heroku buildpack for create-react-app
4. **Docker:** Create Dockerfile and deploy to any container platform

### Environment Variables for Production

Update `.env.production`:
```env
REACT_APP_API_URL=https://your-production-backend.com/api
```

## 🎯 Next Steps

1. **Customize Styling:** Modify CSS files in `src/styles/`
2. **Add More Pages:** Create instructor dashboard, payment management, etc.
3. **Add Charts:** Install recharts and create analytics visualizations
4. **Add Notifications:** Implement toast notifications for user feedback
5. **Add Forms:** Create student registration, session creation forms

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify backend is running
- Check Network tab in DevTools
- Review API response errors

---

**Built for MAD Journey Program**

*Mindset • Accuracy • Discipline*
