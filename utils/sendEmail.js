const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();


// create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({ 
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,            // your Gmail address from .env
    pass: process.env.GMAIL_APP_PASSWORD,    // your App Password from .env
  },
});

// sendEmail function keeps same signature: (to, subject, text, html)
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `"My Nation Blog" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
