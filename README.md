# MAD Journey CRM System

**Mindset • Accuracy • Discipline**

A comprehensive Customer Relationship Management (CRM) system built specifically for the MAD Journey Firearm Training Program by Trent Tactical Services.

## 🎯 Overview

The MAD Journey CRM system is a full-stack application designed to manage the 6-month M-A-D Mastery Program, tracking students from enrollment through graduation. The system manages belt progressions, assessments, payments, attendance, and graduation with firearm selection.

## ✨ Features

### Student Management
- Student registration and profile management
- Automated student ID generation
- Background check status tracking
- Emergency contact information
- Progress tracking dashboard

### Belt Progression System
- Track progression through 6 belt levels (White → Yellow → Orange → Red → Blue → Black)
- Belt-specific curriculum and skill requirements
- Assessment and testing for each belt level
- Automated advancement tracking

### Assessment & Testing
- Skills tests and evaluations
- Live fire qualification tracking
- Drill completion monitoring
- Performance analytics
- Retake scheduling

### Payment Management
- Monthly $225 tuition tracking (6 months)
- Automated payment reminders
- Overdue payment monitoring
- Payment history and receipts
- Revenue reporting

### Session Management
- Training session scheduling
- Instructor assignment
- Capacity management
- Session materials and notes

### Attendance Tracking
- Check-in/check-out system
- Makeup session scheduling
- Attendance statistics
- Attendance rate calculation

### Graduation Management
- Graduation eligibility verification
- Free firearm selection (4 standard options + 3 premium upgrades)
- Background check processing
- Certificate generation
- Firearm delivery tracking

### Instructor Dashboard
- Student roster overview
- Upcoming sessions and tests
- Coaching notes system
- Performance analytics
- Student alerts and notifications

### Admin Dashboard
- Overall statistics and metrics
- Revenue tracking
- Enrollment analytics
- Belt distribution
- Graduate tracking

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Email**: Nodemailer
- **SMS**: Twilio
- **Security**: Helmet, CORS, Rate Limiting
- **PDF Generation**: PDFKit

### Frontend
- **Framework**: React.js with TypeScript
- **UI Library**: Material-UI / Tailwind CSS
- **State Management**: React Context API / Redux
- **HTTP Client**: Axios
- **Routing**: React Router

## 📁 Project Structure

```
CRM_ClaudeCode/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Database configuration
│   │   ├── controllers/             # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── studentController.js
│   │   │   ├── beltController.js
│   │   │   ├── assessmentController.js
│   │   │   ├── paymentController.js
│   │   │   ├── sessionController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── graduationController.js
│   │   │   └── dashboardController.js
│   │   ├── database/
│   │   │   ├── init.js              # Database initialization
│   │   │   └── seed.js              # Sample data seeding
│   │   ├── middleware/
│   │   │   ├── auth.js              # Authentication middleware
│   │   │   └── errorHandler.js      # Error handling
│   │   ├── models/                  # Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Student.js
│   │   │   ├── BeltProgression.js
│   │   │   ├── Assessment.js
│   │   │   ├── Attendance.js
│   │   │   ├── Session.js
│   │   │   ├── Payment.js
│   │   │   ├── Graduation.js
│   │   │   ├── CoachingNote.js
│   │   │   └── index.js
│   │   ├── routes/                  # API routes
│   │   ├── services/
│   │   │   └── notificationService.js
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   └── server.js                # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/
│   └── (React application)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CRM_ClaudeCode
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   DB_NAME=mad_journey_crm
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   ```

4. **Create PostgreSQL database**
   ```bash
   psql -U postgres
   CREATE DATABASE mad_journey_crm;
   \q
   ```

5. **Initialize the database**
   ```bash
   npm run init-db
   ```

6. **Seed the database with sample data (optional)**
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

The API server will start on `http://localhost:5000`

### Sample Credentials (after seeding)

```
Admin:      admin@trenttactical.com / admin123
Instructor: instructor@trenttactical.com / instructor123
Student 1:  student1@example.com / student123 (White Belt)
Student 2:  student2@example.com / student123 (Blue Belt)
Student 3:  student3@example.com / student123 (Graduated)
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Students
- `GET /api/students` - Get all students (Admin/Instructor)
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `GET /api/students/:id/progress` - Get student progress
- `GET /api/students/:id/attendance` - Get attendance history

### Belt Progression
- `GET /api/belts/student/:studentId` - Get belt progressions
- `POST /api/belts/award/:studentId` - Award belt (Instructor)
- `GET /api/belts/curriculum/:beltLevel` - Get belt curriculum

### Assessments
- `POST /api/assessments` - Create assessment (Instructor)
- `GET /api/assessments/student/:studentId` - Get student assessments
- `PUT /api/assessments/:id` - Update assessment
- `GET /api/assessments/student/:studentId/stats` - Assessment statistics

### Payments
- `GET /api/payments/student/:studentId` - Get student payments
- `PUT /api/payments/:id/record` - Record payment (Admin/Staff)
- `PUT /api/payments/:id/status` - Update payment status
- `GET /api/payments` - Get all payments
- `GET /api/payments/overdue` - Get overdue payments

### Sessions
- `POST /api/sessions` - Create session (Instructor)
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/upcoming` - Get upcoming sessions
- `GET /api/sessions/:id` - Get session by ID
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Attendance
- `POST /api/attendance` - Record attendance
- `POST /api/attendance/bulk` - Bulk record attendance
- `PUT /api/attendance/:id` - Update attendance
- `GET /api/attendance/session/:sessionId` - Get session attendance

### Graduation
- `GET /api/graduation/student/:studentId` - Get graduation status
- `POST /api/graduation/student/:studentId/select-firearm` - Select firearm
- `POST /api/graduation/student/:studentId/process` - Process graduation
- `PUT /api/graduation/student/:studentId/firearm-delivery` - Update delivery
- `GET /api/graduation/graduates` - Get all graduates

### Dashboards
- `GET /api/dashboard/admin` - Admin dashboard (Admin)
- `GET /api/dashboard/instructor` - Instructor dashboard (Instructor)
- `GET /api/dashboard/student` - Student dashboard (Student)

## 🎓 MAD Journey Program Structure

### 6-Month Belt Progression

**Month 1 - White Band**
- Skills: Fundamentals, Trigger Control, Grip & Stance
- Test: Verbal Safety Audit + Live Fire Qualification

**Month 2 - Yellow Band**
- Skills: Sight Alignment, Sight Picture, Shooting Control
- Test: Skill Group "B" Tests (8-inch Target)

**Month 3 - Orange Band**
- Skills: Draw from Holster, Rapid Presentation
- Test: Timed Draw & Fire (21 Seconds)

**Month 4 - Red Band**
- Skills: Multiple Target Shooting, Cover & Concealment
- Test: Moving Targets (80% Hit Rate)

**Month 5 - Blue Band**
- Skills: Low Light Shooting, Stress Inoculation
- Test: Combat Accuracy Under Pressure

**Month 6 - Black Band**
- Skills: Advanced Tactics, Low-Light Mastery
- Test: Final Mastery Exam + Graduation Ceremony

### Graduation Firearms

**Included Options (Choose One):**
- Taurus G3C 9mm
- Ruger Security-9
- Glock 17/19/F Elite
- S&W SD9 VE

**Premium Upgrade Options:**
- Glock 19 Gen5 (+$400)
- Sig Sauer P320 (+$500)
- Springfield Hellcat (+$600)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (Admin, Instructor, Student, Staff)
- Rate limiting to prevent abuse
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization

## 📊 Database Schema

### Core Tables
- **users** - User accounts and authentication
- **students** - Student profiles and enrollment info
- **belt_progressions** - Belt advancement records
- **assessments** - Skills tests and evaluations
- **attendances** - Session attendance tracking
- **sessions** - Training session schedules
- **payments** - Monthly tuition payments
- **graduations** - Graduation status and firearm selection
- **coaching_notes** - Instructor feedback and notes

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run init-db    # Initialize database tables
npm run seed       # Seed database with sample data
npm test           # Run tests
```

## 🤝 Contributing

This is a proprietary CRM system for Trent Tactical Services. For internal development only.

## 📄 License

Copyright © 2024 Trent Tactical Services. All rights reserved.

## 📞 Support

For technical support or questions, contact:
- Email: support@trenttacticalservices.com
- Website: https://trenttacticalservices.com

---

**Built with ❤️ for the MAD Journey Program**

*Train for Your Safety. Build Your Skill. Own Your Strength.* 
