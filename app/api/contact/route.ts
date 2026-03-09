import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: false, // port 587 doesn't require secure=true immediately, it upgrades via STARTTLS
    });

    const adminMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Send to the configured admin email
      replyTo: email, // Allow admin to reply directly to the customer
      subject: `[Liên Hệ] Từ khách hàng: ${name}`,
      text: `
Họ và tên: ${name}
Số điện thoại: ${phone}
Email: ${email}
Lời nhắn:
${message}
      `,
      html: `
        <h3>Có khách hàng liên hệ mới!</h3>
        <ul>
          <li><strong>Họ và tên:</strong> ${name}</li>
          <li><strong>Số điện thoại:</strong> ${phone}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        <p><strong>Lời nhắn:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Auto-reply to customer
    const customerMailOptions = {
      from: process.env.EMAIL_FROM,
      to: email, // Send to the customer's email provided in the form
      subject: `[Kilala Eye] Xác nhận thông tin liên hệ`,
      text: `Chào ${name},\n\nCảm ơn bạn đã liên hệ với Kilala Eye. Chúng tôi đã nhận được thông điệp của bạn và đội ngũ chuyên gia sẽ phản hồi qua email hoặc số điện thoại (${phone}) trong thời gian sớm nhất.\n\nNội dung bạn đã gửi:\n${message}\n\nTrân trọng,\nĐội ngũ Kilala Eye`,
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #0d9488;">Cảm ơn bạn đã liên hệ với Kilala Eye!</h2>
          <p>Chào <strong>${name}</strong>,</p>
          <p>Chúng tôi đã nhận được yêu cầu tư vấn của bạn. Đội ngũ chuyên gia sẽ liên hệ lại qua email này hoặc số điện thoại <strong>${phone}</strong> trong thời gian sớm nhất.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Nội dung bạn đã gửi:</strong></p>
          <blockquote style="border-left: 4px solid #0d9488; padding-left: 10px; margin-left: 0; color: #555;">
            ${message.replace(/\n/g, "<br>")}
          </blockquote>
          <p style="margin-top: 30px;">Trân trọng,<br><strong>Đội ngũ Kilala Eye</strong></p>
        </div>
      `,
    };

    console.log(`Sending email for contact request from ${email}...`);
    Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]).then(() => {
      console.log(`Successfully sent contact emails for ${email}`);
    }).catch((err) => {
      console.error(`Background email send error for ${email}:`, err);
    });

    return NextResponse.json({ success: true, message: "Gửi tin nhắn thành công!" }, { status: 200 });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra khi gửi tin nhắn" }, { status: 500 });
  }
}
