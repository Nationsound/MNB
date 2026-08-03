const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();


const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {

    user: process.env.GMAIL_USER,

    pass: process.env.GMAIL_APP_PASSWORD,

  },

   connectionTimeout: 10000,

  greetingTimeout: 10000,

  socketTimeout: 10000,


  tls: {

    rejectUnauthorized: false

  }

});



const sendEmail = async (to, subject, text, html) => {

  const mailOptions = {

    from: `"My Nation Blog" <${process.env.GMAIL_USER}>`,

    to: Array.isArray(to) ? to.join(",") : to,

    subject,

    text,

    html,

  };


  await transporter.sendMail(mailOptions);

};

transporter.verify((error, success)=>{

  if(error){

    console.log("SMTP ERROR:", error);

  }else{

    console.log("SMTP SERVER READY");

  }

});


module.exports = sendEmail;