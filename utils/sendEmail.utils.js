const transporter = require("../config/nodemailer").transporter;
require("dotenv").config(); // For loading .env variables

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Modify App" <${process.env.EMAIL_USER}>`,
      to, // list of receivers
      subject, // Subject line
      html, // html body
    };

    await transporter.sendEmail(mailOptions);
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = { sendEmail };