const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email server error:', error);
  } else {
    console.log('Email server is ready to take our messages');
  }
});

/**
 * Reusable email utility using Nodemailer
 * @param {Object} options - { email, subject, html }
 */
const sendEmail = async (options) => {
  const mailOptions = {
    from: `"BiteDash" <${process.env.EMAIL_USER}>`,
    to: options.email || options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error;
  }
};

module.exports = sendEmail;
