const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'sessions',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'excused', 'late', 'makeup_scheduled'),
    allowNull: false,
    defaultValue: 'present'
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  checkOutTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  makeupSessionId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'sessions',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'attendances'
});

module.exports = Attendance;
