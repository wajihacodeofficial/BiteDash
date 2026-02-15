require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('Testing email with:', {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '********' : 'MISSING'
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"BiteDash Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'BiteDash Login Test',
      text: 'If you see this, your Gmail SMTP is working!',
    });
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

testEmail();
