const { Assessment, Student, User } = require('../models');

const createAssessment = async (req, res, next) => {
  try {
    const {
      studentId,
      beltLevel,
      assessmentType,
      score,
      passed,
      attemptNumber,
      drillsCompleted,
      skillsEvaluated,
      feedback,
      areasForImprovement,
      strengths,
      retakeRequired,
      retakeScheduledDate
    } = req.body;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const assessment = await Assessment.create({
      studentId,
      beltLevel,
      assessmentType,
      assessmentDate: new Date(),
      score,
      passed,
      attemptNumber,
      instructorId: req.user.id,
      drillsCompleted,
      skillsEvaluated,
      feedback,
      areasForImprovement,
      strengths,
      retakeRequired,
      retakeScheduledDate
    });

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

const getStudentAssessments = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { beltLevel, assessmentType } = req.query;

    const where = { studentId };

    if (beltLevel) {
      where.beltLevel = beltLevel;
    }

    if (assessmentType) {
      where.assessmentType = assessmentType;
    }

    const assessments = await Assessment.findAll({
      where,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['assessmentDate', 'DESC']]
    });

    res.json({
      success: true,
      data: assessments
    });
  } catch (error) {
    next(error);
  }
};

const updateAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const assessment = await Assessment.findByPk(id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    await assessment.update(updates);

    res.json({
      success: true,
      message: 'Assessment updated successfully',
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

const getAssessmentStats = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const assessments = await Assessment.findAll({
      where: { studentId }
    });

    const stats = {
      total: assessments.length,
      passed: assessments.filter(a => a.passed).length,
      failed: assessments.filter(a => !a.passed).length,
      averageScore: assessments.length > 0
        ? (assessments.reduce((sum, a) => sum + parseFloat(a.score || 0), 0) / assessments.length).toFixed(2)
        : 0,
      byBeltLevel: {},
      byType: {}
    };

    const beltLevels = ['white', 'yellow', 'orange', 'red', 'blue', 'black'];
    beltLevels.forEach(level => {
      const levelAssessments = assessments.filter(a => a.beltLevel === level);
      stats.byBeltLevel[level] = {
        total: levelAssessments.length,
        passed: levelAssessments.filter(a => a.passed).length
      };
    });

    const types = ['skills_test', 'drill_completion', 'live_fire', 'written_test', 'final_exam'];
    types.forEach(type => {
      const typeAssessments = assessments.filter(a => a.assessmentType === type);
      stats.byType[type] = {
        total: typeAssessments.length,
        passed: typeAssessments.filter(a => a.passed).length
      };
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssessment,
  getStudentAssessments,
  updateAssessment,
  getAssessmentStats
};
