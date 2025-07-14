const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html = null) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    ...(html && { html }),
  });
};

module.exports = sendEmail;
