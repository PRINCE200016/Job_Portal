const nodemailer = require('nodemailer');
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS
} = require('../config/config');

/**
 * Send an email using nodemailer
 * @param {object} options - Email options including to, subject, and text/html
 * @returns {Promise} - Promise with the send result
 */
const sendEmail = async ({ to, subject, text, html }) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  // Send email
  const info = await transporter.sendMail({
    from: `"Jobify" <${EMAIL_USER}>`,
    to,
    subject,
    text,
    html: html || text
  });

  return info;
};

/**
 * Send a welcome email to a new user
 * @param {string} name - User's name
 * @param {string} email - User's email address
 * @returns {Promise} - Promise with the send result
 */
const sendWelcomeEmail = async (name, email) => {
  return sendEmail({
    to: email,
    subject: 'Welcome to Jobify!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6;">Welcome to Jobify!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for joining Jobify! We're excited to have you on board.</p>
        <p>With Jobify, you can:</p>
        <ul>
          <li>Create and manage your professional profile</li>
          <li>Browse and apply for jobs that match your skills</li>
          <li>Track your applications and interviews</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The Jobify Team</p>
      </div>
    `
  });
};

/**
 * Send a password reset email
 * @param {string} name - User's name
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - Password reset URL
 * @returns {Promise} - Promise with the send result
 */
const sendPasswordResetEmail = async (name, email, resetUrl) => {
  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6;">Reset Your Password</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this change, you can ignore this email and your password will remain the same.</p>
        <p>This link is valid for 15 minutes.</p>
        <p>Best regards,<br>The Jobify Team</p>
      </div>
    `
  });
};

/**
 * Send job application confirmation email
 * @param {string} name - User's name
 * @param {string} email - User's email address
 * @param {string} jobTitle - Job title
 * @param {string} companyName - Company name
 * @returns {Promise} - Promise with the send result
 */
const sendApplicationConfirmationEmail = async (name, email, jobTitle, companyName) => {
  return sendEmail({
    to: email,
    subject: `Application Received: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6;">Application Submitted!</h2>
        <p>Hello ${name},</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted.</p>
        <p>You can track the status of your application in your Jobify dashboard.</p>
        <p>Best regards,<br>The Jobify Team</p>
      </div>
    `
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendApplicationConfirmationEmail
}; 