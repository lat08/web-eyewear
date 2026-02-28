"use client";

import { useState, useEffect, Fragment } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Loader2, 
  Tag as TagIcon, 
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";

type Tag = {
  id: number;
  name: string;
  slug: string;
  _count?: { products: number };
};

export default function TagsClient() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/tags?search=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setTags(data.tags);
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
    const timer = setTimeout(() => {
      fetchTags();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ESC key to close modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) handleCloseModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isModalOpen]);

  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingId(tag.id);
      setFormData({
        name: tag.name,
        slug: tag.slug,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", slug: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingId ? `/api/admin/tags/${editingId}` : "/api/admin/tags";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        handleCloseModal();
        fetchTags();
      } else {
        const err = await res.text();
        alert(`Error: ${err}`);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thẻ (tag) này?")) return;
    
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTags();
      } else {
        const err = await res.text();
        alert(`Lỗi xóa: ${err}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generateSlug = (name: string) => {
    const slug = name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
    setFormData({ ...formData, name, slug });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-md group-hover:scale-110 transition-transform">
            <TagIcon size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng Số Thẻ</p>
            <p className="text-3xl font-black text-gray-900">{totalItems}</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-md group-hover:scale-110 transition-transform">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng Liên Kết</p>
            <p className="text-3xl font-black text-gray-900">
               {tags.reduce((acc, tag) => acc + (tag._count?.products || 0), 0)}*
               <span className="text-xs font-normal text-gray-400 ml-1">(trang này)</span>
            </p>
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
                placeholder="Tìm tên thẻ hoặc slug..."
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

            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-md hover:bg-black transition-all shadow-lg shadow-gray-200 text-sm font-black uppercase tracking-widest w-full md:w-auto justify-center"
            >
              <Plus size={18} />
              <span>Thêm Thẻ Mới</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">ID</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Tên Thẻ</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Slug / URL</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Liên Kết</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-teal-600" size={32} />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Đang tải thẻ...</p>
                    </div>
                  </td>
                </tr>
              ) : tags.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <AlertCircle className="text-gray-200" size={48} />
                       <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Không tìm thấy kết quả nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{tag.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-black text-gray-900 group-hover:text-teal-600 transition-colors uppercase tracking-tight">{tag.name}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-[10px] uppercase font-bold tracking-tighter">
                      {tag.slug}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-100">
                        {tag._count?.products || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(tag)}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(tag.id)}
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
        {!loading && tags.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Trang <span className="text-gray-900">{currentPage}</span> / {totalPages} — {totalItems} thẻ
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md transition-all">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-sm border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                {editingId ? "Cập Nhật Thẻ" : "Thêm Thẻ Mới"}
              </h3>
              <button 
                onClick={handleCloseModal} 
                className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-gray-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 text-left">Tên Thẻ (Tags)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => generateSlug(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-bold"
                  placeholder="Ví dụ: Giảm Giá"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 text-left">Slug / URL</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-mono text-xs text-gray-500"
                  placeholder="giam-gia"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Đang lưu..." : (editingId ? "Cập Nhật" : "Lưu Thẻ")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
