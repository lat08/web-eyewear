import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ validatedItems: [], removedItems: [] });
    }

    const validatedItems = [];
    const removedItems = [];

    for (const item of items) {
      // 1. Try finding by productId first
      let product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          images: { where: { isMain: true }, take: 1 }
        }
      });

      // 2. Fallback: find by slug if productId not found
      if (!product && item.slug) {
        product = await prisma.product.findUnique({
          where: { slug: item.slug },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            images: { where: { isMain: true }, take: 1 }
          }
        });
      }

      if (!product) {
        // Product doesn't exist at all
        removedItems.push({
          ...item,
          reason: "Sản phẩm không còn tồn tại trong hệ thống"
        });
        continue;
      }

      if (product.stock <= 0) {
        removedItems.push({
          ...item,
          reason: `Sản phẩm "${product.name}" đã hết hàng`
        });
        continue;
      }

      // Update item with current DB data (fixes stale ID, price, image, stock issues)
      const updatedQuantity = Math.min(item.quantity, product.stock);
      validatedItems.push({
        ...item,
        productId: product.id, // Fix stale productId
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images?.[0]?.url || item.image,
        quantity: updatedQuantity,
        quantityAdjusted: updatedQuantity !== item.quantity,
        maxStock: product.stock
      });
    }

    return NextResponse.json({ validatedItems, removedItems });
  } catch (error) {
    console.error("[CART_VALIDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
