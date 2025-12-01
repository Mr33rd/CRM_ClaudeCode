const { Payment, Student, User } = require('../models');

const getStudentPayments = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const payments = await Payment.findAll({
      where: { studentId },
      order: [['month', 'ASC']]
    });

    const summary = {
      totalAmount: 1350.00,
      paidAmount: payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0),
      pendingAmount: payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0),
      overdueAmount: payments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0),
      paymentsPaid: payments.filter(p => p.status === 'paid').length,
      paymentsRemaining: payments.filter(p => p.status !== 'paid').length
    };

    res.json({
      success: true,
      data: {
        payments,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

const recordPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      paymentMethod,
      transactionId,
      paidDate,
      notes
    } = req.body;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been recorded as paid'
      });
    }

    await payment.update({
      status: 'paid',
      paymentMethod,
      transactionId,
      paidDate: paidDate || new Date(),
      notes
    });

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await payment.update({ status, notes });

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      month
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (month) {
      where.month = parseInt(month);
    }

    const { count, rows } = await Payment.findAndCountAll({
      where,
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
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        payments: rows,
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

const getOverduePayments = async (req, res, next) => {
  try {
    const { Op } = require('sequelize');

    const overduePayments = await Payment.findAll({
      where: {
        status: 'pending',
        dueDate: {
          [Op.lt]: new Date()
        }
      },
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        }
      ],
      order: [['dueDate', 'ASC']]
    });

    // Auto-update status to overdue
    for (const payment of overduePayments) {
      await payment.update({ status: 'overdue' });
    }

    res.json({
      success: true,
      data: overduePayments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentPayments,
  recordPayment,
  updatePaymentStatus,
  getAllPayments,
  getOverduePayments
};
