import PostForm from "@/app/components/admin/PostForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Kilala Admin - Edit Post",
};

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") redirect("/");

  const postId = parseInt((await params).id, 10);
  if (isNaN(postId)) redirect("/admin/posts");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) redirect("/admin/posts");

  return (
    <div className="flex-1 p-8 pt-6 bg-gray-50 min-h-screen">
      <PostForm initialData={post} />
    </div>
  );
}
