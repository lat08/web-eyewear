import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/Breadcrumb";
import { Calendar, User, Tag, ArrowLeft, Facebook, Twitter, Link as LinkIcon } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  return (
    <div className="min-h-screen bg-white pt-[160px] pb-24">
      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumb items={breadcrumbItems} />

        <article className="mt-8">
          {/* Post Header */}
          <header className="mb-10 text-center">
            {post.category && (
              <span className="inline-block bg-teal-50 text-teal-700 text-xs font-black px-4 py-2 rounded-md uppercase tracking-[0.2em] mb-6">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8 tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 font-bold uppercase tracking-widest pb-8 border-b border-gray-100 mb-10">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-teal-600" />
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </span>
              <span className="flex items-center gap-2">
                <User size={16} className="text-teal-600" />
                Kilala Team
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-[300px] md:h-[500px] rounded-md overflow-hidden mb-12 shadow-xl">
            <Image
              src={post.image || "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-normal
            prose-headings:font-black prose-headings:text-gray-900 prose-headings:uppercase prose-headings:tracking-tight
            prose-p:mb-6 prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-md prose-img:shadow-md prose-strong:text-gray-900">
            
            {/* Split content by new lines for simple rendering, or use a markdown parser if preferred */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Social Share & Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Chia sẻ bài viết:</span>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-all">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-all">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-all">
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>

            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-black text-teal-600 uppercase tracking-widest hover:gap-3 transition-all">
              <ArrowLeft size={16} /> Quay lại danh sách
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
