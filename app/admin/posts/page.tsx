import PostsClient from "./PostsClient";

export const metadata = {
  title: "Kilala Admin - Blog Posts",
};

export default function AdminPostsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bài Viết (Blog Posts)</h2>
      </div>
      <PostsClient />
    </div>
  );
}
