const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Graduation = sequelize.define('Graduation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  graduationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  eligibilityStatus: {
    type: DataTypes.ENUM('not_eligible', 'eligible', 'graduated'),
    defaultValue: 'not_eligible',
    allowNull: false
  },
  allBeltsCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allPaymentsCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allAssessmentsPassed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  finalExamScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  finalExamPassed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  firearmSelection: {
    type: DataTypes.ENUM(
      'taurus_g3c',
      'ruger_security_9',
      'glock_17_19_elite',
      'sw_sd9_ve',
      'glock_19_gen5_upgrade',
      'sig_p320_upgrade',
      'springfield_hellcat_upgrade'
    ),
    allowNull: true
  },
  firearmUpgradeCharge: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  firearmSerialNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firearmDeliveryStatus: {
    type: DataTypes.ENUM('pending', 'background_check', 'approved', 'delivered'),
    defaultValue: 'pending'
  },
  firearmDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  certificateNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  certificateUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ceremonyAttended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'graduations',
  hooks: {
    beforeCreate: async (graduation) => {
      if (!graduation.certificateNumber && graduation.eligibilityStatus === 'graduated') {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        graduation.certificateNumber = `MAD-CERT-${timestamp}-${random}`;
      }
    }
  }
});

module.exports = Graduation;
