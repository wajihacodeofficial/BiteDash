const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('Attempting to send email to:', options.email);
  console.log('SMTP Config Check:', {
    user: process.env.EMAIL_USER ? 'PRESENT' : 'MISSING',
    pass: process.env.EMAIL_PASS ? 'PRESENT' : 'MISSING',
    host: 'smtp.gmail.com'
  });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add debug flag for detailed logs
    debug: true,
    logger: true,
  });

  const mailOptions = {
    from: `"BiteDash Verification" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html, // Optional: for HTML emails
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
