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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search } },
        { slug: { contains: search } }
      ]
    } : {};

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          _count: {
            select: { products: true }
          }
        }
      }),
      prisma.collection.count({ where })
    ]);

    return NextResponse.json({
      collections,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("[COLLECTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, slug, image, description } = body;

    if (!name || !slug) {
      return new NextResponse("Name and slug are required", { status: 400 });
    }

    const existing = await prisma.collection.findUnique({
      where: { slug }
    });

    if (existing) {
      return new NextResponse("Slug already exists", { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        image,
        description,
      }
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.error("[COLLECTIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
