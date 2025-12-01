const { verifyToken } = require('../utils/jwt');
const { User, Student } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account is inactive.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

const attachStudentProfile = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'student') {
      const student = await Student.findOne({
        where: { userId: req.user.id }
      });

      if (student) {
        req.studentProfile = student;
      }
    }
    next();
  } catch (error) {
    console.error('Error attaching student profile:', error);
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  attachStudentProfile
};
