const { Attendance, Session, Student, User } = require('../models');

const recordAttendance = async (req, res, next) => {
  try {
    const {
      studentId,
      sessionId,
      status,
      checkInTime,
      checkOutTime,
      notes
    } = req.body;

    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if session exists
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if attendance already recorded
    const existing = await Attendance.findOne({
      where: { studentId, sessionId }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Attendance already recorded for this student and session'
      });
    }

    const attendance = await Attendance.create({
      studentId,
      sessionId,
      status,
      checkInTime: checkInTime || (status === 'present' || status === 'late' ? new Date() : null),
      checkOutTime,
      notes
    });

    // Update session enrollment count
    await session.increment('currentEnrollment');

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, checkOutTime, notes, makeupSessionId } = req.body;

    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await attendance.update({
      status,
      checkOutTime,
      notes,
      makeupSessionId
    });

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

const getSessionAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const attendances = await Attendance.findAll({
      where: { sessionId },
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
      order: [['checkInTime', 'ASC']]
    });

    const stats = {
      total: attendances.length,
      present: attendances.filter(a => a.status === 'present').length,
      absent: attendances.filter(a => a.status === 'absent').length,
      excused: attendances.filter(a => a.status === 'excused').length,
      late: attendances.filter(a => a.status === 'late').length
    };

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

const bulkRecordAttendance = async (req, res, next) => {
  try {
    const { sessionId, attendances } = req.body;

    // Verify session exists
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const records = [];

    for (const record of attendances) {
      const { studentId, status, notes } = record;

      // Check if already recorded
      const existing = await Attendance.findOne({
        where: { studentId, sessionId }
      });

      if (!existing) {
        const attendance = await Attendance.create({
          studentId,
          sessionId,
          status,
          checkInTime: status === 'present' || status === 'late' ? new Date() : null,
          notes
        });
        records.push(attendance);
      }
    }

    // Update session enrollment count
    await session.update({ currentEnrollment: records.length });

    res.status(201).json({
      success: true,
      message: `${records.length} attendance records created successfully`,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordAttendance,
  updateAttendance,
  getSessionAttendance,
  bulkRecordAttendance
};
