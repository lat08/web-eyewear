import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ message: "Thiếu productId" }, { status: 400 });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ canReview: false, reason: "LOGIN_REQUIRED" });
    }

    // 1. Kiểm tra đã từng đánh giá chưa
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: Number(productId),
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json({ canReview: false, reason: "ALREADY_REVIEWED" });
    }

    // 2. Kiểm tra đã mua và đơn hàng thành công chưa
    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "DELIVERED",
        items: {
          some: {
            productId: Number(productId),
          },
        },
      },
    });

    if (!order) {
      // Kiểm tra xem có đơn hàng nào khác không để báo lỗi chính xác hơn
      const anyOrder = await prisma.order.findFirst({
        where: {
          userId: session.user.id,
          items: {
            some: {
              productId: Number(productId),
            },
          },
        },
      });

      if (anyOrder) {
        return NextResponse.json({ canReview: false, reason: "ORDER_NOT_DELIVERED" });
      } else {
        return NextResponse.json({ canReview: false, reason: "NOT_PURCHASED" });
      }
    }

    return NextResponse.json({ canReview: true });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Chưa xác thực" },
        { status: 401 }
      );
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json(
        { message: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Server-side validation again for security
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });

    if (!product) {
      return NextResponse.json(
        { message: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: Number(productId),
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "Bạn đã đánh giá sản phẩm này rồi" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "DELIVERED",
        items: {
          some: {
            productId: Number(productId),
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Bạn cần hoàn tất mua sản phẩm này để có thể đánh giá" },
        { status: 403 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        productId: Number(productId),
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Gửi nhận xét thành công", review },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Review error:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi gửi nhận xét" },
      { status: 500 }
    );
  }
}
