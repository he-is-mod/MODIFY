const nodemailer = require("nodemailer");
require("dotenv").config(); // For loading .env variables

let transporter;

const initEmailTransporter = () => {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g. smtp.gmail.com
    port: process.env.EMAIL_PORT, // e.g. 587 for TLS
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for others
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true, // Enable debug output
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter config error:", error);
    } else {
      console.log("✅ Email transporter is ready to send messages", success);
    }
  });
};


module.exports = { initEmailTransporter, transporter };