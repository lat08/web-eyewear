import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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

    const productId = parseInt((await params).id, 10);
    if (isNaN(productId)) {
      return new NextResponse("Invalid Product ID", { status: 400 });
    }

    const product = await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

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

    const productId = parseInt((await params).id, 10);
    if (isNaN(productId)) {
      return new NextResponse("Invalid Product ID", { status: 400 });
    }

    const body = await req.json();
    const { 
      name, slug, price, originalPrice, stock, description, 
      categoryId, collectionId, productLine, isFeatured, 
      selectedTags, images 
    } = body;

    // First check slug uniqueness
    const existing = await prisma.product.findFirst({
      where: { slug, NOT: { id: productId } }
    });
    
    if (existing) {
      return new NextResponse("Slug already taken", { status: 400 });
    }

    // Perform update in a transaction to ensure atomic consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete existing relations
      await tx.productImage.deleteMany({
        where: { productId }
      });
      
      await tx.productTag.deleteMany({
        where: { productId }
      });

      // 2. Update the product and recreate relations
      return await tx.product.update({
        where: { id: productId },
        data: {
          name,
          slug,
          price,
          originalPrice,
          stock,
          description,
          categoryId,
          collectionId,
          productLine,
          isFeatured,
          images: {
            create: images.map((img: any) => ({
              url: img.url,
              isMain: img.isMain === true || img.isMain === "true" // Handle potential string "true"
            }))
          },
          tags: {
            create: selectedTags.map((tagId: number) => ({
              tag: { connect: { id: tagId } }
            }))
          }
        },
        include: {
          images: true,
          category: true
        }
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[ADMIN_PRODUCT_PUT]", error);
    return new NextResponse(error.message || "Internal error", { status: 500 });
  }
}
