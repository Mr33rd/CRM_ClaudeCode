const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sessionName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sessionType: {
    type: DataTypes.ENUM('regular_training', 'makeup', 'assessment', 'student_only_event', 'graduation'),
    allowNull: false,
    defaultValue: 'regular_training'
  },
  beltLevel: {
    type: DataTypes.ENUM('white', 'yellow', 'orange', 'red', 'blue', 'black', 'all'),
    allowNull: false,
    defaultValue: 'all'
  },
  sessionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 20
  },
  currentEnrollment: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  materials: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  }
}, {
  timestamps: true,
  tableName: 'sessions'
});

module.exports = Session;
