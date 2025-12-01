const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CoachingNote = sequelize.define('CoachingNote', {
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
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'sessions',
      key: 'id'
    }
  },
  noteType: {
    type: DataTypes.ENUM('feedback', 'concern', 'achievement', 'general', 'safety_issue'),
    allowNull: false,
    defaultValue: 'general'
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'If true, only visible to instructors and admins'
  },
  followUpRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'coaching_notes'
});

module.exports = CoachingNote;
