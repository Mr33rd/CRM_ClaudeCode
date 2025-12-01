const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

// Email transporter setup
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Twilio client setup
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

class NotificationService {
  async sendEmail({ to, subject, html, text }) {
    try {
      if (!process.env.EMAIL_USER) {
        console.log('Email service not configured. Skipping email.');
        return { success: false, message: 'Email service not configured' };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html,
        text
      };

      const info = await emailTransporter.sendMail(mailOptions);

      console.log(`Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendSMS({ to, message }) {
    try {
      if (!twilioClient) {
        console.log('SMS service not configured. Skipping SMS.');
        return { success: false, message: 'SMS service not configured' };
      }

      const result = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });

      console.log(`SMS sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  }

  // Predefined email templates

  async sendWelcomeEmail(user, student) {
    const subject = 'Welcome to MAD Journey - Your Firearm Training Begins!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B0000;">Welcome to MAD Journey!</h1>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Congratulations on enrolling in the <strong>M-A-D Mastery Program</strong>!</p>
        <p><strong>Mindset • Accuracy • Discipline</strong></p>

        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2>Your Program Details:</h2>
          <ul>
            <li><strong>Student ID:</strong> ${student.studentId}</li>
            <li><strong>Start Date:</strong> ${new Date(student.enrollmentDate).toLocaleDateString()}</li>
            <li><strong>Expected Graduation:</strong> ${new Date(student.expectedGraduationDate).toLocaleDateString()}</li>
            <li><strong>Current Belt Level:</strong> White Band</li>
          </ul>
        </div>

        <p>You're about to embark on a comprehensive 6-month firearm training journey. Upon successful completion, you'll receive a free firearm of your choice!</p>

        <p>Check your student portal for upcoming training sessions and program materials.</p>

        <p>Train for Your Safety. Build Your Skill. Own Your Strength.</p>

        <p>Best regards,<br>Trent Tactical Services Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendBeltAdvancementEmail(user, student, newBelt) {
    const beltNames = {
      yellow: 'Yellow Band',
      orange: 'Orange Band',
      red: 'Red Band',
      blue: 'Blue Band',
      black: 'Black Band'
    };

    const subject = `Congratulations! You've Advanced to ${beltNames[newBelt]}!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B0000;">🎯 Belt Advancement!</h1>
        <p>Dear ${user.firstName},</p>
        <p>Congratulations on advancing to the <strong>${beltNames[newBelt]}</strong> in the MAD Journey program!</p>

        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p>Your hard work, dedication, and skill development have paid off. Keep up the excellent progress!</p>
        </div>

        <p>Check your student portal for your next training modules and upcoming assessments.</p>

        <p>Best regards,<br>Trent Tactical Services Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendPaymentReminderEmail(user, payment) {
    const subject = 'Payment Reminder - MAD Journey Program';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B0000;">Payment Reminder</h1>
        <p>Dear ${user.firstName},</p>
        <p>This is a friendly reminder that your payment for Month ${payment.month} of the MAD Journey program is due.</p>

        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <ul>
            <li><strong>Amount Due:</strong> $${payment.amount}</li>
            <li><strong>Due Date:</strong> ${new Date(payment.dueDate).toLocaleDateString()}</li>
            <li><strong>Month:</strong> ${payment.month} of 6</li>
          </ul>
        </div>

        <p>Please make your payment at your earliest convenience to continue your training without interruption.</p>

        <p>Best regards,<br>Trent Tactical Services Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendGraduationEmail(user, student, graduation) {
    const subject = 'Congratulations on Completing MAD Journey! 🎓';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B0000;">🎓 Congratulations, Graduate!</h1>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>You've successfully completed the <strong>M-A-D Mastery Program</strong>!</p>

        <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2>Your Achievement:</h2>
          <ul>
            <li><strong>Certificate Number:</strong> ${graduation.certificateNumber}</li>
            <li><strong>Graduation Date:</strong> ${new Date(graduation.graduationDate).toLocaleDateString()}</li>
            <li><strong>Final Exam Score:</strong> ${graduation.finalExamScore}%</li>
          </ul>
        </div>

        <p>Your free graduation firearm will be ready for pickup soon. We'll contact you regarding the delivery process and background check.</p>

        <p>Thank you for your dedication and commitment to the MAD Journey program.</p>

        <p>Best regards,<br>Trent Tactical Services Team</p>
      </div>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendSessionReminderSMS(phone, sessionName, sessionDate) {
    const message = `MAD Journey Reminder: ${sessionName} scheduled for ${new Date(sessionDate).toLocaleDateString()} at ${new Date(sessionDate).toLocaleTimeString()}. See you there!`;

    return await this.sendSMS({
      to: phone,
      message
    });
  }
}

module.exports = new NotificationService();
