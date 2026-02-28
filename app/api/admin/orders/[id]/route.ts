import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: (await params).id },
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            product: {
              select: { name: true, slug: true, images: { where: { isMain: true }, take: 1 } }
            }
          }
        }
      }
    });

    if (!order) return new NextResponse("Not Found", { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ADMIN_ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, paymentStatus } = body;

    // Use transaction if we need to restore stock on cancellation
    const result = await prisma.$transaction(async (tx) => {
      // Get current order state to check if we're changing to CANCELLED
      const currentOrder = await tx.order.findUnique({
        where: { id: (await params).id },
        include: { items: true }
      });

      if (!currentOrder) throw new Error("Order not found");

      // Logic to restore stock if cancelled
      if (status === "CANCELLED" && currentOrder.status !== "CANCELLED") {
        for (const item of currentOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
      } 
      // Logic to REDUCE stock if moving BACK from Cancelled (optional but good for completeness)
      else if (currentOrder.status === "CANCELLED" && status && status !== "CANCELLED") {
        for (const item of currentOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      return await tx.order.update({
        where: { id: (await params).id },
        data: {
          status: status !== undefined ? status : undefined,
          paymentStatus: paymentStatus !== undefined ? paymentStatus : undefined,
        },
        include: {
          user: { select: { name: true, email: true } }
        }
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[ADMIN_ORDER_PUT]", error);
    return new NextResponse(error.message || "Internal error", { status: 500 });
  }
}
