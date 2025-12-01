const { Graduation, Student, User, Payment, BeltProgression, Assessment } = require('../models');

const getGraduationStatus = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const graduation = await Graduation.findOne({
      where: { studentId },
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email']
            }
          ]
        }
      ]
    });

    if (!graduation) {
      return res.status(404).json({
        success: false,
        message: 'Graduation record not found'
      });
    }

    // Check eligibility criteria
    const student = await Student.findByPk(studentId);
    const payments = await Payment.findAll({ where: { studentId } });
    const beltProgressions = await BeltProgression.findAll({ where: { studentId } });
    const assessments = await Assessment.findAll({ where: { studentId, passed: true } });

    const allPaymentsPaid = payments.every(p => p.status === 'paid');
    const hasBlackBelt = student.currentBeltLevel === 'black';
    const allBeltsCompleted = beltProgressions.length >= 6;

    const eligible = allPaymentsPaid && hasBlackBelt && allBeltsCompleted;

    // Update graduation eligibility
    await graduation.update({
      allBeltsCompleted,
      allPaymentsCompleted: allPaymentsPaid,
      allAssessmentsPassed: assessments.length >= 6,
      eligibilityStatus: eligible ? 'eligible' : 'not_eligible'
    });

    res.json({
      success: true,
      data: {
        graduation,
        eligibility: {
          isEligible: eligible,
          criteria: {
            allBeltsCompleted: {
              met: allBeltsCompleted,
              current: beltProgressions.length,
              required: 6
            },
            allPaymentsCompleted: {
              met: allPaymentsPaid,
              paid: payments.filter(p => p.status === 'paid').length,
              total: 6
            },
            hasBlackBelt: {
              met: hasBlackBelt,
              currentBelt: student.currentBeltLevel
            }
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const selectFirearm = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { firearmSelection } = req.body;

    const graduation = await Graduation.findOne({
      where: { studentId }
    });

    if (!graduation) {
      return res.status(404).json({
        success: false,
        message: 'Graduation record not found'
      });
    }

    if (graduation.eligibilityStatus !== 'eligible' && graduation.eligibilityStatus !== 'graduated') {
      return res.status(400).json({
        success: false,
        message: 'Student is not eligible for graduation yet'
      });
    }

    // Calculate upgrade charge
    const upgradeCharges = {
      'glock_19_gen5_upgrade': 400.00,
      'sig_p320_upgrade': 500.00,
      'springfield_hellcat_upgrade': 600.00
    };

    const upgradeCharge = upgradeCharges[firearmSelection] || 0;

    await graduation.update({
      firearmSelection,
      firearmUpgradeCharge: upgradeCharge,
      firearmDeliveryStatus: 'pending'
    });

    res.json({
      success: true,
      message: 'Firearm selection recorded successfully',
      data: {
        firearmSelection,
        upgradeCharge,
        totalCost: upgradeCharge > 0 ? upgradeCharge : 'Free (included in program)'
      }
    });
  } catch (error) {
    next(error);
  }
};

const processGraduation = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const {
      finalExamScore,
      finalExamPassed,
      graduationDate,
      firearmSerialNumber,
      ceremonyAttended,
      notes
    } = req.body;

    const graduation = await Graduation.findOne({
      where: { studentId }
    });

    if (!graduation) {
      return res.status(404).json({
        success: false,
        message: 'Graduation record not found'
      });
    }

    const student = await Student.findByPk(studentId);

    // Generate certificate number if not exists
    let certificateNumber = graduation.certificateNumber;
    if (!certificateNumber) {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      certificateNumber = `MAD-CERT-${timestamp}-${random}`;
    }

    await graduation.update({
      finalExamScore,
      finalExamPassed,
      graduationDate: graduationDate || new Date(),
      firearmSerialNumber,
      ceremonyAttended,
      notes,
      eligibilityStatus: 'graduated',
      certificateNumber
    });

    await student.update({
      status: 'graduated',
      actualGraduationDate: graduationDate || new Date()
    });

    res.json({
      success: true,
      message: 'Graduation processed successfully! Congratulations!',
      data: graduation
    });
  } catch (error) {
    next(error);
  }
};

const updateFirearmDelivery = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const {
      firearmDeliveryStatus,
      firearmDeliveryDate,
      firearmSerialNumber
    } = req.body;

    const graduation = await Graduation.findOne({
      where: { studentId }
    });

    if (!graduation) {
      return res.status(404).json({
        success: false,
        message: 'Graduation record not found'
      });
    }

    await graduation.update({
      firearmDeliveryStatus,
      firearmDeliveryDate,
      firearmSerialNumber
    });

    res.json({
      success: true,
      message: 'Firearm delivery status updated successfully',
      data: graduation
    });
  } catch (error) {
    next(error);
  }
};

const getAllGraduates = async (req, res, next) => {
  try {
    const graduates = await Graduation.findAll({
      where: { eligibilityStatus: 'graduated' },
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email']
            }
          ]
        }
      ],
      order: [['graduationDate', 'DESC']]
    });

    res.json({
      success: true,
      data: graduates
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGraduationStatus,
  selectFirearm,
  processGraduation,
  updateFirearmDelivery,
  getAllGraduates
};
