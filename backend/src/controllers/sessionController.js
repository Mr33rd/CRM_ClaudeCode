const { Session, Attendance, User, Student } = require('../models');
const { Op } = require('sequelize');

const createSession = async (req, res, next) => {
  try {
    const {
      sessionName,
      sessionType,
      beltLevel,
      sessionDate,
      startTime,
      endTime,
      location,
      maxCapacity,
      description,
      notes,
      materials
    } = req.body;

    const session = await Session.create({
      sessionName,
      sessionType,
      beltLevel,
      sessionDate,
      startTime,
      endTime,
      location,
      instructorId: req.user.id,
      maxCapacity,
      description,
      notes,
      materials,
      status: 'scheduled'
    });

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

const getAllSessions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      beltLevel,
      sessionType,
      startDate,
      endDate
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (beltLevel) {
      where.beltLevel = beltLevel;
    }

    if (sessionType) {
      where.sessionType = sessionType;
    }

    if (startDate || endDate) {
      where.sessionDate = {};
      if (startDate) {
        where.sessionDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.sessionDate[Op.lte] = new Date(endDate);
      }
    }

    const { count, rows } = await Session.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Attendance,
          as: 'attendances',
          separate: true
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['sessionDate', 'DESC'], ['startTime', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        sessions: rows,
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

const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await Session.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Attendance,
          as: 'attendances',
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
          ]
        }
      ]
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    delete updates.instructorId; // Don't allow changing instructor via update

    await session.update(updates);

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await Session.findByPk(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if session has attendances
    const attendanceCount = await Attendance.count({
      where: { sessionId: id }
    });

    if (attendanceCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete session with existing attendance records. Consider marking it as cancelled instead.'
      });
    }

    await session.destroy();

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getUpcomingSessions = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const sessions = await Session.findAll({
      where: {
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
      limit: parseInt(limit),
      order: [['sessionDate', 'ASC'], ['startTime', 'ASC']]
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getUpcomingSessions
};
