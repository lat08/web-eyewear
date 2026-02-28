import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const rating = searchParams.get("rating");

    const where: any = {
      OR: [
        { comment: { contains: search } },
        { product: { name: { contains: search } } },
        { user: { name: { contains: search } } },
      ]
    };

    if (rating && rating !== "all") {
      where.rating = parseInt(rating);
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          product: { select: { name: true, slug: true, images: { where: { isMain: true }, take: 1 } } }
        }
      }),
      prisma.review.count({ where })
    ]);

    return NextResponse.json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("[ADMIN_REVIEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
