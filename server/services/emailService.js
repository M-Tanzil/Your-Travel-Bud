const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);
    throw error;
  }
};

const sendBookingConfirmation = async (user, booking, type = 'hotel') => {
  const typeLabels = { hotel: 'Hotel', train: 'Train', bus: 'Bus' };
  const subject = `${typeLabels[type]} Booking Confirmation - ${booking.bookingReference}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1>Travel Buddy</h1>
        <h2>Booking Confirmed!</h2>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${user.name},</p>
        <p>Your ${typeLabels[type]} booking has been confirmed.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3>Booking Details</h3>
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
          <p><strong>Total Amount:</strong> ${booking.currency} ${booking.totalPrice}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
        </div>
        <p>Thank you for choosing Travel Buddy!</p>
      </div>
    </div>
  `;

  return sendEmail({ to: user.email, subject, html });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const subject = 'Travel Buddy - Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1>Travel Buddy</h1>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

const sendAnnouncementEmail = async (users, subject, body) => {
  const emailPromises = users.map((user) =>
    sendEmail({
      to: user.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1>Travel Buddy</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${user.name},</p>
            ${body}
            <hr/>
            <p style="color: #6b7280; font-size: 12px;">You received this email because you are registered on Travel Buddy.</p>
          </div>
        </div>
      `,
    })
  );

  const results = await Promise.allSettled(emailPromises);
  const sent = results.filter((r) => r.status === 'fulfilled').length;
  logger.info(`Announcement email sent to ${sent}/${users.length} users`);
  return sent;
};

const sendAdminSupportAlert = async (user, message) => {
  const subject = `New Support Message from ${user.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>New Support Message</h2>
      <p><strong>From:</strong> ${user.name} (${user.email})</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  `;
  return sendEmail({ to: process.env.ADMIN_EMAIL, subject, html });
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendPasswordResetEmail,
  sendAnnouncementEmail,
  sendAdminSupportAlert,
};
