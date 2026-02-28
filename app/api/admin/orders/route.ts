import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        {
          OR: [
            { id: { contains: search } },
            { user: { name: { contains: search } } },
            { user: { email: { contains: search } } },
          ]
        }
      ]
    };

    if (status && status !== "ALL") {
      where.AND.push({ status });
    }

    const [orders, total, totalRevenue, pendingCount] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          _count: {
            select: { items: true }
          }
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.order.count({
        where: { status: "PENDING" }
      })
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingCount
      }
    });
  } catch (error) {
    console.error("[ADMIN_ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
