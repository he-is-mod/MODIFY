const { sendEmail } = require("../utils/sendEmail.utils");
const ejs = require("ejs");
const path = require("path");

const sendTokens = async ({ token, email }) => {
        const subject = "Your Token";

        const templatePath = path.join(
          __dirname,
          "../views/emails/sendToken.ejs"
        );
        const html = await ejs.renderFile(templatePath, { token });

  return await sendEmail(email, subject, html);
};
module.exports = { sendTokens };    