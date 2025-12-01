const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  currentBeltLevel: {
    type: DataTypes.ENUM('white', 'yellow', 'orange', 'red', 'blue', 'black'),
    defaultValue: 'white',
    allowNull: false
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expectedGraduationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualGraduationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'on_hold', 'graduated', 'withdrawn', 'suspended'),
    defaultValue: 'active',
    allowNull: false
  },
  emergencyContactName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emergencyContactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emergencyContactRelationship: {
    type: DataTypes.STRING,
    allowNull: true
  },
  backgroundCheckStatus: {
    type: DataTypes.ENUM('pending', 'in_progress', 'approved', 'denied'),
    defaultValue: 'pending'
  },
  backgroundCheckDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'students',
  hooks: {
    beforeCreate: async (student) => {
      if (!student.studentId) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        student.studentId = `MAD-${timestamp}${random}`;
      }
      if (!student.expectedGraduationDate && student.enrollmentDate) {
        const gradDate = new Date(student.enrollmentDate);
        gradDate.setMonth(gradDate.getMonth() + 6);
        student.expectedGraduationDate = gradDate;
      }
    }
  }
});

module.exports = Student;
