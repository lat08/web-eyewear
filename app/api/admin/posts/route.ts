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
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const where: any = {
      OR: [
        { title: { contains: search } },
        { slug: { contains: search } },
      ]
    };

    if (status && status !== "all") {
      where.isPublished = status === "published";
    }

    if (category && category !== "all") {
      where.category = category;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count({ where })
    ]);

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("[ADMIN_POSTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { title, slug, excerpt, content, image, category, isPublished } = body;

    if (!title || !slug || !content) return new NextResponse("Missing required fields", { status: 400 });

    const existingSlug = await prisma.post.findUnique({ where: { slug } });
    if (existingSlug) return new NextResponse("Slug already exists", { status: 400 });

    const post = await prisma.post.create({
      data: {
        title, slug, excerpt, content, image, category, 
        isPublished: isPublished ?? true
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[ADMIN_POSTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
