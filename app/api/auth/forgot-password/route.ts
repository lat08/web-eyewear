import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Vui lòng nhập email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email không tồn tại trong hệ thống" },
        { status: 404 }
      );
    }

    // Tạo token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Hết hạn sau 1 giờ

    // Lưu vào database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Sử dụng AUTH_URL hoặc fallback về localhost
    const baseUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Cấu hình SMTP Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Kilala Eye" <noreply@kilala.vn>',
      to: email,
      subject: "Yêu cầu khôi phục mật khẩu - Kilala Eye",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f766e; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; text-transform: uppercase;">Kilala Eye</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <h2 style="color: #111827; font-size: 20px; margin-top: 0;">Xin chào,</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
              Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản liên kết với địa chỉ email này. 
              Nếu bạn không yêu cầu điều này, xin vui lòng bỏ qua email.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #0f766e; color: white; text-decoration: none; padding: 14px 28px; font-weight: bold; border-radius: 6px; letter-spacing: 1px; text-transform: uppercase;">
                Đặt Lại Mật Khẩu
              </a>
            </div>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 8px;">
              Lưu ý: Link này chỉ có hiệu lực trong vòng 1 giờ.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              Hoặc bạn có thể copy đường link dưới đây và dán vào trình duyệt: <br/>
              <a href="${resetUrl}" style="color: #0d9488; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        message: "Link khôi phục mật khẩu đã được gửi (vui lòng kiểm tra email của bạn)",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
