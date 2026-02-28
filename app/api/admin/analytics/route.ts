import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

    // Parallel fetching for performance
    const [orders, products, users, lowStockItems] = await Promise.all([
      prisma.order.findMany({ select: { totalAmount: true, status: true } }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.product.findMany({
        where: { stock: { lt: 10 } },
        select: { id: true, name: true, slug: true, stock: true },
        take: 5
      })
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.status === "PENDING").length;

    // Recent 5 Activity (Orders)
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    });

    return NextResponse.json({
      metrics: {
        totalRevenue,
        pendingOrders,
        totalProducts: products,
        totalUsers: users,
      },
      lowStockItems,
      recentOrders
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
