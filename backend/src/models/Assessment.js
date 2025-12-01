const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Assessment = sequelize.define('Assessment', {
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
  assessmentType: {
    type: DataTypes.ENUM('skills_test', 'drill_completion', 'live_fire', 'written_test', 'final_exam'),
    allowNull: false
  },
  assessmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  passed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  attemptNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  drillsCompleted: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  skillsEvaluated: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  areasForImprovement: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  strengths: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  retakeRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  retakeScheduledDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'assessments'
});

module.exports = Assessment;
