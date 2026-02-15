const sendEmail = require('./sendEmail');

const sendOrderConfirmation = async (email, orderId, amount) => {
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2563eb;">Order Confirmed!</h2>
      <p>Your order <strong>#${orderId}</strong> has been placed successfully.</p>
      <p>Total Amount: <strong>Rs. ${amount}</strong></p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 0.9em; color: #666;">Thank you for choosing BiteDash!</p>
    </div>
  `;

  return await sendEmail({
    email,
    subject: 'Order Confirmed - BiteDash',
    html: htmlContent
  });
};

module.exports = { sendOrderConfirmation };
