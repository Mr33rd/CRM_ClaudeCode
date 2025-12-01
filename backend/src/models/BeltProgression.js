const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BeltProgression = sequelize.define('BeltProgression', {
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
  beltLevel: {
    type: DataTypes.ENUM('white', 'yellow', 'orange', 'red', 'blue', 'black'),
    allowNull: false
  },
  achievedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  testScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  testPassed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skillsChecklist: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  certificateIssued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  certificateUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'belt_progressions'
});

module.exports = BeltProgression;
