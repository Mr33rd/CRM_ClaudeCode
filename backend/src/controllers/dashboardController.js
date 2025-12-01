const { Student, User, Session, Payment, BeltProgression, Assessment, Attendance, Graduation } = require('../models');
const { Op } = require('sequelize');

const getInstructorDashboard = async (req, res, next) => {
  try {
    // Get total active students
    const totalStudents = await Student.count({
      where: { status: 'active' }
    });

    // Students by belt level
    const beltLevels = ['white', 'yellow', 'orange', 'red', 'blue', 'black'];
    const studentsByBelt = {};

    for (const belt of beltLevels) {
      studentsByBelt[belt] = await Student.count({
        where: {
          currentBeltLevel: belt,
          status: 'active'
        }
      });
    }

    // Upcoming sessions for this instructor
    const upcomingSessions = await Session.findAll({
      where: {
        instructorId: req.user.id,
        sessionDate: {
          [Op.gte]: new Date()
        },
        status: 'scheduled'
      },
      limit: 5,
      order: [['sessionDate', 'ASC']]
    });

    // Recent assessments
    const recentAssessments = await Assessment.findAll({
      where: {
        instructorId: req.user.id
      },
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        }
      ],
      limit: 10,
      order: [['assessmentDate', 'DESC']]
    });

    // Students needing attention (overdue payments, failed assessments, poor attendance)
    const overduePayments = await Payment.count({
      where: {
        status: 'overdue'
      }
    });

    const upcomingGraduations = await Graduation.count({
      where: {
        eligibilityStatus: 'eligible'
      }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          studentsByBelt,
          overduePayments,
          upcomingGraduations
        },
        upcomingSessions,
        recentAssessments
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAdminDashboard = async (req, res, next) => {
  try {
    // Overall statistics
    const totalStudents = await Student.count();
    const activeStudents = await Student.count({ where: { status: 'active' } });
    const graduates = await Student.count({ where: { status: 'graduated' } });
    const withdrawnStudents = await Student.count({ where: { status: 'withdrawn' } });

    // Revenue statistics
    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'paid' }
    });

    const pendingRevenue = await Payment.sum('amount', {
      where: { status: 'pending' }
    });

    const overdueRevenue = await Payment.sum('amount', {
      where: { status: 'overdue' }
    });

    // This month's revenue
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Payment.sum('amount', {
      where: {
        status: 'paid',
        paidDate: {
          [Op.gte]: thisMonthStart
        }
      }
    });

    // Belt distribution
    const beltLevels = ['white', 'yellow', 'orange', 'red', 'blue', 'black'];
    const beltDistribution = {};

    for (const belt of beltLevels) {
      beltDistribution[belt] = await Student.count({
        where: {
          currentBeltLevel: belt,
          status: 'active'
        }
      });
    }

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEnrollments = await Student.count({
      where: {
        enrollmentDate: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Upcoming graduations
    const eligibleGraduates = await Graduation.count({
      where: { eligibilityStatus: 'eligible' }
    });

    // Session statistics
    const totalSessions = await Session.count();
    const upcomingSessions = await Session.count({
      where: {
        sessionDate: {
          [Op.gte]: new Date()
        },
        status: 'scheduled'
      }
    });

    // Instructor statistics
    const totalInstructors = await User.count({
      where: { role: 'instructor', isActive: true }
    });

    res.json({
      success: true,
      data: {
        students: {
          total: totalStudents,
          active: activeStudents,
          graduates,
          withdrawn: withdrawnStudents,
          recentEnrollments
        },
        revenue: {
          total: totalRevenue || 0,
          monthly: monthlyRevenue || 0,
          pending: pendingRevenue || 0,
          overdue: overdueRevenue || 0
        },
        beltDistribution,
        sessions: {
          total: totalSessions,
          upcoming: upcomingSessions
        },
        instructors: {
          total: totalInstructors
        },
        graduations: {
          eligible: eligibleGraduates
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getStudentDashboard = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: BeltProgression,
          as: 'beltProgressions',
          order: [['achievedDate', 'DESC']],
          limit: 1
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
        message: 'Student profile not found'
      });
    }

    // Upcoming sessions for student's belt level
    const upcomingSessions = await Session.findAll({
      where: {
        [Op.or]: [
          { beltLevel: student.currentBeltLevel },
          { beltLevel: 'all' }
        ],
        sessionDate: {
          [Op.gte]: new Date()
        },
        status: 'scheduled'
      },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['firstName', 'lastName']
        }
      ],
      limit: 5,
      order: [['sessionDate', 'ASC']]
    });

    // Recent assessments
    const recentAssessments = await Assessment.findAll({
      where: { studentId: student.id },
      limit: 5,
      order: [['assessmentDate', 'DESC']]
    });

    // Payment summary
    const paidPayments = student.payments.filter(p => p.status === 'paid');
    const pendingPayments = student.payments.filter(p => p.status === 'pending');
    const overduePayments = student.payments.filter(p => p.status === 'overdue');

    // Calculate progress
    const beltLevels = ['white', 'yellow', 'orange', 'red', 'blue', 'black'];
    const currentBeltIndex = beltLevels.indexOf(student.currentBeltLevel);
    const progressPercentage = ((currentBeltIndex + 1) / beltLevels.length) * 100;

    res.json({
      success: true,
      data: {
        studentInfo: {
          studentId: student.studentId,
          currentBeltLevel: student.currentBeltLevel,
          enrollmentDate: student.enrollmentDate,
          expectedGraduationDate: student.expectedGraduationDate,
          status: student.status,
          progressPercentage: progressPercentage.toFixed(2)
        },
        payments: {
          paid: paidPayments.length,
          pending: pendingPayments.length,
          overdue: overduePayments.length,
          total: 6,
          amountPaid: paidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
        },
        upcomingSessions,
        recentAssessments,
        graduation: student.graduation
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstructorDashboard,
  getAdminDashboard,
  getStudentDashboard
};
