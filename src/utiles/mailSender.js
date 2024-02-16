const nodemailer = require("nodemailer");

async function sendMail(recipientEmail, userData, text, postUrl, screenshot) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const html = `
      <p>작성자 메일: ${userData}</p>
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

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Email Sending Failed: ", error);
    return false;
  }
}

module.exports = { sendMail };
