import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs";

/**
 * Process a base64 string image if valid, saving it to disk.
 * Returns the relative URL if successful, otherwise the original string (e.g. if it's already an uploaded URL).
 * 
 * @param imageString A base64 string or an existing image URL
 * @returns The new relative URL or the existing string
 */
export async function processImageUpload(imageString: string | null | undefined): Promise<string | null> {
  if (!imageString) return null;

  // Check if it's a base64 data URL
  const matches = imageString.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  
  // If not a base64 string, return as is (could be an existing /uploads/... path)
  if (!matches || matches.length !== 3) {
    return imageString;
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  
  // Determine extension
  let ext = ".jpg";
  if (mimeType.includes("png")) ext = ".png";
  else if (mimeType.includes("webp")) ext = ".webp";
  else if (mimeType.includes("gif")) ext = ".gif";

  const buffer = Buffer.from(base64Data, 'base64');
  const fileName = `${randomUUID()}${ext}`;
  
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  try {
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    await writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Failed to save image locally", error);
    // Return original string if fail, though it will likely break in DB if it's a massive string
    throw new Error("Cannot save image to disk.");
  }
}
