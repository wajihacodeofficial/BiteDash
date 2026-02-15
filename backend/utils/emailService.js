const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'notifications@bitedash.com', // Mock creds, in prod utilize proper SMTP
    pass: 'securepassword',
  },
});

const sendOrderConfirmation = async (email, orderId, amount) => {
  console.log(
    `[EMAIL MOCK] Sending Order ${orderId} confirmation to ${email} for Rs. ${amount}`
  );

  await transporter.sendMail({
    from: '"BiteDash" <notifications@bitedash.com>',
    to: email,
    subject: 'Order Confirmed - BiteDash',
    text: `Your order #${orderId} has been placed successfully. Total: Rs. ${amount}`,
  });

  return true;
};

module.exports = { sendOrderConfirmation };
