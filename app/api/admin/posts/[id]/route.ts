import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

    const postId = parseInt((await params).id, 10);
    if (isNaN(postId)) return new NextResponse("Invalid ID", { status: 400 });

    const body = await req.json();
    const { title, slug, excerpt, content, image, category, isPublished } = body;

    const existingSlug = await prisma.post.findFirst({
      where: { slug, NOT: { id: postId } }
    });
    if (existingSlug) return new NextResponse("Slug already exists", { status: 400 });

    const post = await prisma.post.update({
      where: { id: postId },
      data: { title, slug, excerpt, content, image, category, isPublished }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[ADMIN_POST_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

    const postId = parseInt((await params).id, 10);
    if (isNaN(postId)) return new NextResponse("Invalid ID", { status: 400 });

    await prisma.post.delete({ where: { id: postId } });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("[ADMIN_POST_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
