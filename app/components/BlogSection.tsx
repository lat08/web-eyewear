import prisma from "@/lib/prisma";
import BlogCarousel from "./BlogCarousel";

export default async function BlogSection() {
  const prismaAny = prisma as any;
  const posts = await prismaAny.post.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <section className="py-24 px-4 md:px-8 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        {/* Header Title with Line */}
        <div className="flex items-center mb-12">
          <h2 className="text-[22px] font-bold text-gray-800 uppercase whitespace-nowrap pr-4 tracking-wide">
            GÓC KILALA
          </h2>
          <div className="flex-grow h-[1px] bg-gray-300"></div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 italic">Hiện chưa có bài viết nào.</p>
          </div>
        ) : (
          <BlogCarousel posts={posts.map((p: any) => ({
            id: p.id,
            title: p.title,
            date: new Date(p.createdAt).toLocaleDateString("vi-VN"),
            image: p.image || "/images/blog-placeholder.jpg",
            link: `/blog/${p.slug}`
          }))} />
        )}
      </div>
    </section>
  );
}
