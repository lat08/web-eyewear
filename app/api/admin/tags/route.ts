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

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          id: 'desc'
        },
        include: {
          _count: {
            select: { products: true }
          }
        }
      }),
      prisma.tag.count({ where })
    ]);

    return NextResponse.json({
      tags,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("[TAGS_GET]", error);
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
    const { name, slug } = body;

    if (!name || !slug) {
      return new NextResponse("Name and slug are required", { status: 400 });
    }

    const existingName = await prisma.tag.findUnique({ where: { name } });
    if (existingName) return new NextResponse("Tag name already exists", { status: 400 });

    const existingSlug = await prisma.tag.findUnique({ where: { slug } });
    if (existingSlug) return new NextResponse("Slug already exists", { status: 400 });

    const tag = await prisma.tag.create({
      data: { name, slug }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("[TAGS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
