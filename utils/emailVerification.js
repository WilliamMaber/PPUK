const nodemailer = require("nodemailer");
const emailVerificationConfig = require("../data/emailVerification.json");

// create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: emailVerificationConfig.host,
  port: emailVerificationConfig.port,
  secure: emailVerificationConfig.secure,
  auth: {
    user: emailVerificationConfig.user,
    pass: emailVerificationConfig.password,
  },
});

/**
 * Sends an email verification link to the given user's email address.
 * @param {string} email The email address to send the verification link to.
 * @param {string} token The verification token to include in the verification link.
 * @returns {Promise<void>} A Promise that resolves when the email is sent.
 */
async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
  const mailOptions = {
    from: "My App <noreply@myapp.com>",
    to: email,
    subject: "Verify your email address",
    html: emailVerificationConfig.template.replace(
      /%verificationUrl%/g,
      verificationUrl
    ),
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
