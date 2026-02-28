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
    const categoryId = searchParams.get("categoryId");
    const collectionId = searchParams.get("collectionId");
    const stockStatus = searchParams.get("stockStatus") || "ALL";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search } },
          ]
        }
      ]
    };

    if (categoryId && categoryId !== "ALL") {
      where.AND.push({ categoryId: parseInt(categoryId) });
    }

    if (collectionId && collectionId !== "ALL") {
      where.AND.push({ collectionId: parseInt(collectionId) });
    }

    if (stockStatus === "IN_STOCK") {
      where.AND.push({ stock: { gt: 0 } });
    } else if (stockStatus === "OUT_OF_STOCK") {
      where.AND.push({ stock: { lte: 0 } });
    }

    const [products, total, totalCategories, outOfStockCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true } },
          collection: { select: { name: true } },
          images: {
            where: { isMain: true },
            take: 1
          }
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.category.count(),
      prisma.product.count({ where: { stock: { lte: 0 } } })
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalProducts: total,
        totalCategories,
        outOfStockCount
      }
    });
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_GET]", error);
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
    const { 
      name, slug, price, originalPrice, stock, description, 
      categoryId, collectionId, productLine, isFeatured, 
      selectedTags, images 
    } = body;

    if (!name || !slug || price === undefined || stock === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingSlug = await prisma.product.findUnique({
      where: { slug }
    });
    
    if (existingSlug) {
      return new NextResponse("Slug already exists", { status: 400 });
    }

    const product = await prisma.product.create({
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
            isMain: img.isMain === true || img.isMain === "true"
          }))
        },
        tags: {
          create: selectedTags.map((tagId: number) => ({
            tag: { connect: { id: tagId } }
          }))
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
