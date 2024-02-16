const nodemailer = require("nodemailer");

async function sendMail(recipientEmail, text, postUrl, screenshot) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const html = `
      <p>${text}</p>
      <a href=${postUrl}>${postUrl}</a>
      <br>
      <img src=${screenshot} alt="이미지" style="max-width: 1200px; width: 100%;">
    `;

    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: recipientEmail,
      subject: "its comments mail",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent: ", info);

    return true;
  } catch (error) {
    console.error("Email Sending Failed: ", error);
    return false;
  }
}

module.exports = { sendMail };
