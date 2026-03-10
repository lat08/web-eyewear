import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { processImageUpload } from "@/lib/upload";
import { revalidatePath } from "next/cache";

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

    const collectionId = parseInt((await params).id, 10);
    if (isNaN(collectionId)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const existing = await prisma.collection.findFirst({
      where: { 
        slug,
        NOT: { id: collectionId }
      }
    });

    if (existing) {
      return new NextResponse("Slug already taken", { status: 400 });
    }

    const processedImage = await processImageUpload(image);

    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: { name, slug, image: processedImage, description }
    });

    revalidatePath('/', 'layout');

    return NextResponse.json(collection);
  } catch (error) {
    console.error("[COLLECTION_PUT]", error);
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

    const collectionId = parseInt((await params).id, 10);
    if (isNaN(collectionId)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const collection = await prisma.collection.delete({
      where: { id: collectionId }
    });

    revalidatePath('/', 'layout');

    return NextResponse.json(collection);
  } catch (error) {
    console.error("[COLLECTION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
