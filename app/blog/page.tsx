import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/app/components/Breadcrumb";
import { ChevronRight, Calendar, User, Tag } from "lucide-react";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  const breadcrumbItems = [{ label: "Blog", href: "/blog" }];

  return (
    <div className="min-h-screen bg-gray-50 pt-[160px] pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mt-8 mb-12">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">
            Blog & Tin Tức
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Cập nhật những thông tin mới nhất về xu hướng mắt kính, hướng dẫn chăm sóc mắt và các chương trình ưu đãi độc quyền từ Kilala Eye.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-md border border-gray-100 shadow-sm">
            <p className="text-gray-400 italic">Hiện chưa có bài viết nào. Vui lòng quay lại sau!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col group">
                <Link href={`/blog/${post.slug}`} className="relative h-60 overflow-hidden">
                  <Image
                    src={post.image || "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-teal-600 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest shadow-lg">
                      {post.category}
                    </span>
                  )}
                </Link>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-4 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-teal-600" />
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={12} className="text-teal-600" />
                      Kilala Team
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-gray-900 mb-3 group-hover:text-teal-600 transition-colors leading-tight line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-black text-teal-600 uppercase tracking-widest hover:gap-3 transition-all"
                    >
                      Đọc tiếp <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
