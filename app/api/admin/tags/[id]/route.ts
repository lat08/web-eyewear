import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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
    const { name, slug } = body;

    if (!name || !slug) {
      return new NextResponse("Name and slug are required", { status: 400 });
    }

    const tagId = parseInt((await params).id, 10);
    if (isNaN(tagId)) return new NextResponse("Invalid ID", { status: 400 });

    // Check unique constraints for name and slug, excluding current tag
    const existingName = await prisma.tag.findFirst({
      where: { name, NOT: { id: tagId } }
    });
    if (existingName) return new NextResponse("Name already taken", { status: 400 });

    const existingSlug = await prisma.tag.findFirst({
      where: { slug, NOT: { id: tagId } }
    });
    if (existingSlug) return new NextResponse("Slug already taken", { status: 400 });

    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: { name, slug }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("[TAG_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tagId = parseInt((await params).id, 10);
    if (isNaN(tagId)) return new NextResponse("Invalid ID", { status: 400 });

    const tag = await prisma.tag.delete({
      where: { id: tagId }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("[TAG_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
