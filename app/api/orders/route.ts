import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập để đặt hàng" },
        { status: 401 }
      );
    }

    const { items, totalAmount, shippingInfo } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Giỏ hàng trống" },
        { status: 400 }
      );
    }

    // Generate a random order number
    const orderNumber = `KL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Execute in transaction to ensure stock consistency
    return await prisma.$transaction(async (tx) => {
      // Resolve all product IDs first (handle stale IDs via slug fallback)
      const resolvedItems = [];

      for (const item of items) {
        // 1. Try by productId
        let product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true, name: true }
        });

        // 2. Fallback: try by slug
        if (!product && item.slug) {
          product = await tx.product.findUnique({
            where: { slug: item.slug },
            select: { id: true, stock: true, name: true }
          });
        }

        if (!product) {
          throw new Error(`Sản phẩm "${item.name || item.productId}" không tồn tại. Vui lòng xóa giỏ hàng và thử lại.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Sản phẩm "${product.name}" không đủ hàng trong kho (Còn: ${product.stock}, Cần: ${item.quantity})`);
        }

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

        resolvedItems.push({
          ...item,
          productId: product.id, // Use the resolved (correct) ID
        });
      }

      // Create the order with resolved product IDs
      const order = await tx.order.create({
        data: {
          orderNumber,
          totalAmount,
          status: "PENDING",
          paymentMethod: shippingInfo.paymentMethod || "COD",
          paymentStatus: "UNPAID",
          shippingName: shippingInfo.name,
          shippingPhone: shippingInfo.phone,
          shippingAddress: shippingInfo.address,
          shippingCity: shippingInfo.city,
          userId: session.user?.id,
          items: {
            create: resolvedItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              leftPower: item.leftPower,
              rightPower: item.rightPower,
            })),
          },
        },
      });

      return NextResponse.json(
        { message: "Đặt hàng thành công", orderId: order.id, orderNumber: order.orderNumber },
        { status: 201 }
      );
    });

  } catch (error: any) {
    console.error("Order creation error:", error);
    const status = error.message.includes("không đủ hàng") || error.message.includes("không tồn tại") ? 400 : 500;
    return NextResponse.json(
      { message: error.message || "Đã xảy ra lỗi khi đặt hàng" },
      { status }
    );
  }
}
