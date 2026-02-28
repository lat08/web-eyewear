import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

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

    // Tạo link reset mật khẩu
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // GIẢ LẬP GỬI EMAIL (Trong thực tế bạn sẽ dùng Nodemailer, SendGrid, etc.)
    console.log("-----------------------------------------");
    console.log("PASSWOD RESET LINK FOR:", email);
    console.log(resetUrl);
    console.log("-----------------------------------------");

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
