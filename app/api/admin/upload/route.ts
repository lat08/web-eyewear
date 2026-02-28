import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return new NextResponse("No files uploaded", { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Already exists or other error
    }

    const uploadedUrls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename to avoid collisions
      const ext = path.extname(file.name) || ".jpg";
      const fileName = `${randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      
      // Store the relative path to be used in the browser
      uploadedUrls.push({
        url: `/uploads/${fileName}`,
        name: file.name
      });
    }

    return NextResponse.json(uploadedUrls);
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
