import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

    const userId = (await params).id;
    if (!userId) return new NextResponse("Invalid ID", { status: 400 });

    const body = await req.json();
    const { userRole } = body;

    if (userRole !== "ADMIN" && userRole !== "USER") {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: userRole }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[ADMIN_USER_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 });

    const userId = (await params).id;
    if (!userId) return new NextResponse("Invalid ID", { status: 400 });

    // Prevent deleting oneself
    if (session.user?.id === userId) {
      return new NextResponse("Cannot delete your own admin account", { status: 403 });
    }

    // Check if user to be deleted is an admin
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (targetUser?.role === 'ADMIN') {
      return new NextResponse("Cannot delete an admin account", { status: 403 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("[ADMIN_USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
