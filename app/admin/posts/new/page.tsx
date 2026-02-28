import PostForm from "@/app/components/admin/PostForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kilala Admin - New Post",
};

export default async function NewPostPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") redirect("/");

  return (
    <div className="flex-1 p-8 pt-6 bg-gray-50 min-h-screen">
      <PostForm />
    </div>
  );
}
