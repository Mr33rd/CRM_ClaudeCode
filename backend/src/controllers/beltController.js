const { BeltProgression, Student, User } = require('../models');

const getBeltProgressions = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const progressions = await BeltProgression.findAll({
      where: { studentId },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['achievedDate', 'ASC']]
    });

    res.json({
      success: true,
      data: progressions
    });
  } catch (error) {
    next(error);
  }
};

const awardBelt = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const {
      beltLevel,
      testScore,
      testPassed,
      notes,
      skillsChecklist
    } = req.body;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify belt progression order
    const beltLevels = ['white', 'yellow', 'orange', 'red', 'blue', 'black'];
    const currentIndex = beltLevels.indexOf(student.currentBeltLevel);
    const newIndex = beltLevels.indexOf(beltLevel);

    if (newIndex !== currentIndex + 1 && beltLevel !== student.currentBeltLevel) {
      return res.status(400).json({
        success: false,
        message: `Cannot award ${beltLevel} belt. Student must progress sequentially through belt levels.`
      });
    }

    // Create belt progression record
    const progression = await BeltProgression.create({
      studentId,
      beltLevel,
      testScore,
      testPassed,
      instructorId: req.user.id,
      notes,
      skillsChecklist,
      achievedDate: new Date()
    });

    // Update student's current belt level if test passed
    if (testPassed && newIndex > currentIndex) {
      await student.update({ currentBeltLevel: beltLevel });
    }

    res.status(201).json({
      success: true,
      message: `${beltLevel} belt ${testPassed ? 'awarded' : 'attempted'} successfully`,
      data: progression
    });
  } catch (error) {
    next(error);
  }
};

const getBeltCurriculum = async (req, res, next) => {
  try {
    const { beltLevel } = req.params;

    const curriculum = {
      white: {
        month: 1,
        name: 'White Band',
        skills: [
          'Firearm Fundamentals',
          'Trigger Control Practice',
          'Grip, Stance & Posture',
          'Safety Audit'
        ],
        drills: [
          'Safety Basics',
          'Dry Fire Drills',
          'Proper Grip Formation',
          'Stance & Posture Practice'
        ],
        test: {
          name: 'Verbal Safety Audit + Live Fire Qualification',
          passingScore: 80
        }
      },
      yellow: {
        month: 2,
        name: 'Yellow Band',
        skills: [
          'Sight Alignment',
          'Sight Picture',
          'Shooting Control'
        ],
        drills: [
          'Slow Fire Accuracy',
          '3-5-7 Yard Drills'
        ],
        test: {
          name: 'Skill Group "B" Tests (8-inch Target)',
          passingScore: 85
        }
      },
      orange: {
        month: 3,
        name: 'Orange Band',
        skills: [
          'Draw from Holster',
          'Rapid Presentation'
        ],
        drills: [
          'Draw & Fire Drills',
          'Transition Drills'
        ],
        test: {
          name: 'Timed Draw & Fire Drills (21 Seconds)',
          passingScore: 85
        }
      },
      red: {
        month: 4,
        name: 'Red Band',
        skills: [
          'Multiple Target Shooting',
          'Cover & Concealment'
        ],
        drills: [
          'Lateral Move Drills',
          'Shoot & Move',
          'Tactical Reloads'
        ],
        test: {
          name: 'Moving Targets Engagement (80% Hit Rate)',
          passingScore: 80
        }
      },
      blue: {
        month: 5,
        name: 'Blue Band',
        skills: [
          'Low Light Shooting',
          'Stress Inoculation'
        ],
        drills: [
          'Low-Light Drills',
          'High-Stress Scenarios'
        ],
        test: {
          name: 'Combat Accuracy Test Under Pressure',
          passingScore: 85
        }
      },
      black: {
        month: 6,
        name: 'Black Band',
        skills: [
          'Advanced Tactics',
          'Low-Light Shooting Mastery'
        ],
        drills: [
          'Force-on-Force Training',
          'Scenario-Based Training'
        ],
        test: {
          name: 'Final Mastery Exam + Graduation Ceremony',
          passingScore: 90
        }
      }
    };

    const data = curriculum[beltLevel];

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Belt level not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBeltProgressions,
  awardBelt,
  getBeltCurriculum
};
