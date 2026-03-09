require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

async function test() {
  console.log("Testing email with user:", process.env.EMAIL_USER);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: false,
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `[Liên Hệ] Test gửi mail từ hệ thống`,
    text: `Đây là email test để kiểm tra backend.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Success:", info.response);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
