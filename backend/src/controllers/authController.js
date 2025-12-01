const { User, Student, Graduation, Payment } = require('../models');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'student'
    });

    // Create student profile
    const student = await Student.create({
      userId: user.id,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      currentBeltLevel: 'white',
      status: 'active'
    });

    // Create graduation record
    await Graduation.create({
      studentId: student.id,
      eligibilityStatus: 'not_eligible'
    });

    // Create 6 monthly payment records
    const enrollmentDate = new Date();
    const payments = [];
    for (let month = 1; month <= 6; month++) {
      const dueDate = new Date(enrollmentDate);
      dueDate.setMonth(dueDate.getMonth() + month - 1);

      payments.push({
        studentId: student.id,
        amount: 225.00,
        paymentType: 'monthly_tuition',
        status: month === 1 ? 'pending' : 'pending',
        dueDate,
        month
      });
    }
    await Payment.bulkCreate(payments);

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to MAD Journey!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        student: {
          studentId: student.studentId,
          currentBeltLevel: student.currentBeltLevel,
          expectedGraduationDate: student.expectedGraduationDate
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Student,
          as: 'studentProfile',
          required: false
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const response = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    };

    if (user.studentProfile) {
      response.student = {
        studentId: user.studentProfile.studentId,
        currentBeltLevel: user.studentProfile.currentBeltLevel,
        status: user.studentProfile.status
      };
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: response
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Student,
          as: 'studentProfile',
          required: false,
          include: [
            {
              model: Graduation,
              as: 'graduation'
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;

    await req.user.update({
      firstName,
      lastName,
      phone
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
