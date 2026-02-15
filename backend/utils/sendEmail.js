const { Resend } = require('resend');

/**
 * Reusable email utility using Resend SDK
 * @param {Object} options - { email, subject, html, message }
 * Note: Supporting 'message' as fallback for 'text' content to maintain compatibility
 */
const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const to = options.email || options.to;
  const subject = options.subject;
  const html = options.html || options.message; // Use message as fallback if html is not provided

  console.log(`[Resend] Attempting to send email to: ${to}`);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('[Resend Error]', error);
      throw new Error(`Resend Error: ${error.message}`);
    }

    console.log('[Resend Success]', data);
    return data;
  } catch (err) {
    console.error('[Resend Exception]', err.message);
    throw err; // Propagate error for controller handling
  }
};

module.exports = sendEmail;
