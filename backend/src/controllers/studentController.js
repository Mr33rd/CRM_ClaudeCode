const { Student, User, BeltProgression, Assessment, Attendance, Payment, Graduation, CoachingNote, Session } = require('../models');
const { Op } = require('sequelize');

const getAllStudents = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      beltLevel,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (beltLevel) {
      where.currentBeltLevel = beltLevel;
    }

    const include = [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName', 'phone']
      }
    ];

    if (search) {
      include[0].where = {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const { count, rows } = await Student.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        students: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'phone']
        },
        {
          model: BeltProgression,
          as: 'beltProgressions',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['firstName', 'lastName']
            }
          ],
          order: [['achievedDate', 'DESC']]
        },
        {
          model: Assessment,
          as: 'assessments',
          limit: 10,
          order: [['assessmentDate', 'DESC']]
        },
        {
          model: Payment,
          as: 'payments',
          order: [['month', 'ASC']]
        },
        {
          model: Graduation,
          as: 'graduation'
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Don't allow direct updates to certain fields
    delete updates.userId;
    delete updates.studentId;

    await student.update(updates);

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

const getStudentProgress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: BeltProgression,
          as: 'beltProgressions',
          order: [['achievedDate', 'ASC']]
        },
        {
          model: Assessment,
          as: 'assessments',
          where: { passed: true },
          required: false
        },
        {
          model: Payment,
          as: 'payments'
        },
        {
          model: Graduation,
          as: 'graduation'
        }
      ]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Calculate progress statistics
    const beltLevels = ['white', 'yellow', 'orange', 'red', 'blue', 'black'];
    const currentBeltIndex = beltLevels.indexOf(student.currentBeltLevel);
    const progressPercentage = ((currentBeltIndex + 1) / beltLevels.length) * 100;

    const paidPayments = student.payments.filter(p => p.status === 'paid');
    const paymentProgress = (paidPayments.length / 6) * 100;

    const passedAssessments = student.assessments.length;

    const daysEnrolled = Math.floor((new Date() - new Date(student.enrollmentDate)) / (1000 * 60 * 60 * 24));
    const expectedDays = 180; // 6 months
    const timeProgress = Math.min((daysEnrolled / expectedDays) * 100, 100);

    res.json({
      success: true,
      data: {
        student: {
          name: `${student.user.firstName} ${student.user.lastName}`,
          studentId: student.studentId,
          currentBeltLevel: student.currentBeltLevel,
          enrollmentDate: student.enrollmentDate,
          expectedGraduationDate: student.expectedGraduationDate,
          status: student.status
        },
        progress: {
          beltProgress: {
            current: student.currentBeltLevel,
            percentage: progressPercentage,
            beltsCompleted: currentBeltIndex + 1,
            totalBelts: beltLevels.length
          },
          paymentProgress: {
            percentage: paymentProgress,
            paid: paidPayments.length,
            total: 6,
            amountPaid: paidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
            totalAmount: 1350
          },
          assessmentProgress: {
            passed: passedAssessments
          },
          timeProgress: {
            percentage: timeProgress,
            daysEnrolled,
            totalDays: expectedDays
          }
        },
        graduation: student.graduation
      }
    });
  } catch (error) {
    next(error);
  }
};

const getStudentAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attendances = await Attendance.findAll({
      where: { studentId: id },
      include: [
        {
          model: Session,
          as: 'session',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['firstName', 'lastName']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const stats = {
      total: attendances.length,
      present: attendances.filter(a => a.status === 'present').length,
      absent: attendances.filter(a => a.status === 'absent').length,
      excused: attendances.filter(a => a.status === 'excused').length,
      late: attendances.filter(a => a.status === 'late').length
    };

    stats.attendanceRate = stats.total > 0
      ? ((stats.present + stats.late) / stats.total * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        attendances,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent,
  getStudentProgress,
  getStudentAttendance
};
