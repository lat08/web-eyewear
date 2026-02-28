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
    const { name, slug, image, description } = body;

    if (!name || !slug) {
      return new NextResponse("Name and slug are required", { status: 400 });
    }

    const categoryId = parseInt((await params).id, 10);
    if (isNaN(categoryId)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // Check if updating to a slug that already belongs to another category
    const existingCategory = await prisma.category.findFirst({
      where: { 
        slug,
        NOT: {
          id: categoryId
        }
      }
    });

    if (existingCategory) {
      return new NextResponse("Slug already taken", { status: 400 });
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        slug,
        image,
        description,
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PUT]", error);
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

    const categoryId = parseInt((await params).id, 10);
    if (isNaN(categoryId)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const category = await prisma.category.delete({
      where: {
        id: categoryId,
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
