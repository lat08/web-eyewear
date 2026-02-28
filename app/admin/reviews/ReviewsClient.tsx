"use client";

import { useState, useEffect, Fragment } from "react";
import { 
  Search, 
  Loader2, 
  Trash2, 
  Star, 
  User as UserIcon, 
  MessageSquare,
  TrendingUp,
  AlertCircle,
  X,
  Calendar,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import Image from "next/image";

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null; email: string | null };
  product: { name: string; slug: string; images: { url: string }[] };
};

export default function ReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // This will be used for rating (all, 1, 2, 3, 4, 5)
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/reviews?search=${encodeURIComponent(searchQuery)}&rating=${statusFilter}&page=${currentPage}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
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
    const timer = setTimeout(() => fetchReviews(), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm("CẢNH BÁO: Xóa đánh giá này vĩnh viễn?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) fetchReviews();
      else alert(`Lỗi: ${await res.text()}`);
    } catch (error) {
      console.error(error);
    }
  };

  const avgRating = totalItems > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) // Note: this is page-based avg if using current reviews state
    : 0;

  const fiveStarCount = reviews.filter(r => r.rating === 5).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-md group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng Đánh Giá</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-md group-hover:scale-110 transition-transform">
            <Star size={24} className="fill-yellow-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Điểm Trung Bình (Trang)</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{avgRating} / 5.0</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-md group-hover:scale-110 transition-transform">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">5 Sao (Trang)</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{fiveStarCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Tìm theo sản phẩm, nội dung..."
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

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-48 pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-md focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="all">Tất cả xếp hạng</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                  <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                  <option value="3">⭐⭐⭐ (3 sao)</option>
                  <option value="2">⭐⭐ (2 sao)</option>
                  <option value="1">⭐ (1 sao)</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">ID</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Sản Phẩm</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Khách Hàng</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Xếp Hạng</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Nội Dung</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Ngày Đăng</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-teal-600 mx-auto" size={32} />
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                     <div className="flex flex-col items-center gap-2">
                       <AlertCircle className="text-gray-200" size={48} />
                       <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Không có đánh giá nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{review.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:scale-105 transition-transform">
                          {review.product.images?.[0]?.url ? (
                            <Image src={review.product.images[0].url} alt="pic" fill className="object-cover" />
                          ) : (
                            <ShoppingBag className="text-gray-200" size={20} />
                          )}
                        </div>
                        <div className="font-black text-gray-900 group-hover:text-teal-600 transition-colors uppercase tracking-tight line-clamp-2 max-w-[200px]">
                          {review.product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-black text-gray-900 uppercase tracking-tight">
                        <UserIcon size={14} className="text-gray-400" />
                        {review.user.name || "Khách"}
                      </div>
                      <div className="text-[10px] text-gray-500 ml-5">{review.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-0.5 justify-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={12} 
                            className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 line-clamp-2 italic max-w-xs bg-gray-50/50 p-2 rounded-md border border-gray-100">
                        &quot;{review.comment || "Không có nội dung"}&quot;
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-gray-400">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => handleDelete(review.id)} 
                         className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-md transition-all border border-transparent hover:border-rose-100 opacity-20 group-hover:opacity-100" 
                         title="Xóa đánh giá"
                       >
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && reviews.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Trang <span className="text-gray-900">{currentPage}</span> / {totalPages} — {totalItems} đánh giá
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
