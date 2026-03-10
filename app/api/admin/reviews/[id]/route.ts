import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

    const reviewId = parseInt((await params).id, 10);
    if (isNaN(reviewId)) return new NextResponse("Invalid ID", { status: 400 });

    await prisma.review.delete({ where: { id: reviewId } });

    revalidatePath('/', 'layout');

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("[ADMIN_REVIEW_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
