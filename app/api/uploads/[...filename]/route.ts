import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function GET(req: Request, { params }: { params: Promise<{ filename: string[] }> }) {
  try {
    const filenameArr = (await params).filename;
    
    if (!filenameArr || filenameArr.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const filename = filenameArr.join("/");
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    
    if (!fs.existsSync(filePath)) {
      console.log("[UPLOAD_GET] File not found:", filePath);
      return new NextResponse("Not Found", { status: 404 });
    }
    
    const buffer = await readFile(filePath);
    
    let mimeType = "image/jpeg";
    if (filename.endsWith(".png")) mimeType = "image/png";
    else if (filename.endsWith(".webp")) mimeType = "image/webp";
    else if (filename.endsWith(".gif")) mimeType = "image/gif";
    else if (filename.endsWith(".svg")) mimeType = "image/svg+xml";

    return new Response(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[UPLOAD_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
