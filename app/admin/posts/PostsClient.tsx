"use client";

import { useState, useEffect, Fragment } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Loader2, 
  Image as ImageIcon, 
  Eye, 
  EyeOff,
  Newspaper,
  CheckCircle2,
  FileText,
  AlertCircle,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Post = {
  id: number;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  image: string | null;
  createdAt: string;
};

export default function PostsClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/posts?search=${encodeURIComponent(searchQuery)}&status=${statusFilter}&category=${categoryFilter}&page=${currentPage}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalItems(data.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchPosts(), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, categoryFilter, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm("CẢNH BÁO: Bạn có chắc muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) fetchPosts();
      else alert(`Lỗi: ${await res.text()}`);
    } catch (error) {
      console.error(error);
    }
  };

  // Categories for filtering - we might want to fetch these from an API, but for now we can use common ones
  const categories = ["news", "promotion", "guide", "health"];

  const publishedCount = posts.filter(p => p.isPublished).length;
  const draftCount = posts.length - publishedCount;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-md group-hover:scale-110 transition-transform">
            <Newspaper size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng Bài Viết</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-md group-hover:scale-110 transition-transform">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Xuất Bản (Trang)</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{publishedCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-gray-100 text-gray-500 rounded-md group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bản Nháp (Trang)</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{draftCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
            <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Tìm tiêu đề hoặc nội dung bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-md focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-medium"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-md focus:bg-white focus:border-teal-500 transition-all text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-md focus:bg-white focus:border-teal-500 transition-all text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="all">Tất cả bài viết</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>

            <Link
              href="/admin/posts/new"
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-md hover:bg-black transition-all shadow-lg shadow-gray-200 text-sm font-black uppercase tracking-widest w-full md:w-auto justify-center"
            >
              <Plus size={18} />
              <span>Viết Bài Mới</span>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">ID</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Bài Viết</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Chuyên Mục</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Trạng Thái</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Ngày Tạo</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-teal-600" size={32} />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Đang tải bài viết...</p>
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <AlertCircle className="text-gray-200" size={48} />
                       <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Không tìm thấy bài viết nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{post.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-md bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:scale-105 transition-transform">
                          {post.image ? (
                            <Image src={post.image} alt="pic" fill className="object-cover" />
                          ) : (
                            <ImageIcon className="text-gray-300" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 group-hover:text-teal-600 transition-colors uppercase tracking-tight line-clamp-1">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                            /{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-blue-600">
                        <Layers size={12} />
                        <span className="text-xs font-black uppercase tracking-widest">{post.category || "General"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center">
                        {post.isPublished ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-100 shadow-sm shadow-emerald-50">
                            <Eye size={12} /> Public
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-md border border-gray-200">
                            <EyeOff size={12} /> Draft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-gray-400">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/posts/${post.id}`} 
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)} 
                          className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-md transition-all border border-transparent hover:border-rose-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && posts.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Trang <span className="text-gray-900">{currentPage}</span> / {totalPages} — {totalItems} bài viết
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 border border-gray-200 rounded-md hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, i, arr) => (
                    <Fragment key={p}>
                      {i > 0 && arr[i-1] !== p - 1 && <span className="text-gray-300 text-xs px-1">...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-black transition-all ${
                          currentPage === p
                            ? "bg-teal-600 text-white shadow-md shadow-teal-100"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-teal-500 hover:text-teal-600"
                        }`}
                      >
                        {p}
                      </button>
                    </Fragment>
                  ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 border border-gray-200 rounded-md hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
