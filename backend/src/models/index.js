const { sequelize } = require('../config/database');
const User = require('./User');
const Student = require('./Student');
const BeltProgression = require('./BeltProgression');
const Assessment = require('./Assessment');
const Attendance = require('./Attendance');
const Session = require('./Session');
const Payment = require('./Payment');
const Graduation = require('./Graduation');
const CoachingNote = require('./CoachingNote');

// Define relationships

// User -> Student (One-to-One)
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Student -> BeltProgression (One-to-Many)
Student.hasMany(BeltProgression, { foreignKey: 'studentId', as: 'beltProgressions' });
BeltProgression.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> Assessment (One-to-Many)
Student.hasMany(Assessment, { foreignKey: 'studentId', as: 'assessments' });
Assessment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> Attendance (One-to-Many)
Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> Payment (One-to-Many)
Student.hasMany(Payment, { foreignKey: 'studentId', as: 'payments' });
Payment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> Graduation (One-to-One)
Student.hasOne(Graduation, { foreignKey: 'studentId', as: 'graduation' });
Graduation.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> CoachingNote (One-to-Many)
Student.hasMany(CoachingNote, { foreignKey: 'studentId', as: 'coachingNotes' });
CoachingNote.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Session -> Attendance (One-to-Many)
Session.hasMany(Attendance, { foreignKey: 'sessionId', as: 'attendances' });
Attendance.belongsTo(Session, { foreignKey: 'sessionId', as: 'session' });

// Session -> CoachingNote (One-to-Many)
Session.hasMany(CoachingNote, { foreignKey: 'sessionId', as: 'coachingNotes' });
CoachingNote.belongsTo(Session, { foreignKey: 'sessionId', as: 'session' });

// Instructor relationships (User as Instructor)
User.hasMany(Session, { foreignKey: 'instructorId', as: 'sessionsInstructed' });
Session.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

User.hasMany(BeltProgression, { foreignKey: 'instructorId', as: 'beltProgressionsAwarded' });
BeltProgression.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

User.hasMany(Assessment, { foreignKey: 'instructorId', as: 'assessmentsConducted' });
Assessment.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

User.hasMany(CoachingNote, { foreignKey: 'instructorId', as: 'coachingNotesCreated' });
CoachingNote.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

// Makeup session relationship
Attendance.belongsTo(Session, { foreignKey: 'makeupSessionId', as: 'makeupSession' });

const db = {
  sequelize,
  User,
  Student,
  BeltProgression,
  Assessment,
  Attendance,
  Session,
  Payment,
  Graduation,
  CoachingNote
};

module.exports = db;
