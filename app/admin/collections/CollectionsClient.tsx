"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Loader2, 
  FolderHeart, 
  ShoppingBag, 
  Image as ImageIcon,
  Upload,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

type Collection = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  _count?: { products: number };
  createdAt: string;
};

export default function CollectionsClient() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
  });

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/collections?search=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections);
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
      fetchCollections();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenModal = (collection?: Collection) => {
    if (collection) {
      setEditingId(collection.id);
      setFormData({
        name: collection.name,
        slug: collection.slug,
        image: collection.image || "",
        description: collection.description || "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", slug: "", image: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      const form = new FormData();
      form.append("files", files[0]);
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form
      });
      
      if (res.ok) {
        const uploaded = await res.json();
        if (uploaded.length > 0) {
          setFormData(prev => ({ ...prev, image: uploaded[0].url }));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi tải ảnh!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingId ? `/api/admin/collections/${editingId}` : "/api/admin/collections";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        handleCloseModal();
        fetchCollections();
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
    if (!confirm("Bạn có chắc chắn muốn xóa bộ sưu tập này?")) return;
    
    try {
      const res = await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCollections();
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
          <div className="p-4 bg-purple-50 text-purple-600 rounded-md group-hover:scale-110 transition-transform">
            <FolderHeart size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng Bộ Sưu Tập</p>
            <p className="text-3xl font-black text-gray-900">{totalItems}</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-md group-hover:scale-110 transition-transform">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sản Phẩm Trong BST</p>
            <p className="text-3xl font-black text-gray-900">
               {collections.reduce((acc, col) => acc + (col._count?.products || 0), 0)}*
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
                placeholder="Tìm sản phẩm bộ sưu tập..."
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
              <span>Thêm Mới BST</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">ID</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Bộ Sưu Tập</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Slug / URL</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Sản Phẩm</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-teal-600" size={32} />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Đang tải bộ sưu tập...</p>
                    </div>
                  </td>
                </tr>
              ) : collections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <AlertCircle className="text-gray-200" size={48} />
                       <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Không tìm thấy kết quả nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                collections.map((col) => (
                  <tr key={col.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{col.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:scale-105 transition-transform">
                          {col.image ? (
                            <Image src={col.image} alt={col.name} fill className="object-cover" />
                          ) : (
                            <ImageIcon size={18} className="text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 group-hover:text-teal-600 transition-colors uppercase tracking-tight">{col.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">{col.description || "Không có mô tả"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase font-bold tracking-tighter">
                        {col.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 text-orange-700 text-xs font-black border border-orange-100">
                        {col._count?.products || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(col)}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(col.id)}
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
        {!loading && collections.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Trang <span className="text-gray-900">{currentPage}</span> / {totalPages} — {totalItems} bộ sưu tập
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

      {/* Modal - Modern Design */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md transition-all overflow-y-auto">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-lg border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                {editingId ? "Cập Nhật Bộ Sưu Tập" : "Thêm Bộ Sưu Tập Mới"}
              </h3>
              <button 
                onClick={handleCloseModal} 
                className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-gray-900 hover:shadow-md transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload for Collection */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">Ảnh Bìa / Thumbnail</label>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden shrink-0">
                    {formData.image ? (
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-300" size={32} />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="animate-spin text-teal-600" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={onFileChange} 
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <Upload size={14} /> Tải ảnh lên
                    </button>
                    <p className="text-[10px] text-gray-400">Ảnh chất lượng cao cho banner BST.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tên Bộ Sưu Tập</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => generateSlug(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-bold"
                    placeholder="Ví dụ: Fall Winter 2026"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Slug / URL</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-mono text-xs text-gray-500"
                    placeholder="fall-winter-2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Mô Tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm resize-none font-medium"
                  placeholder="Giới thiệu ngắn về bộ sưu tập..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="px-8 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 disabled:opacity-50 flex items-center gap-2 active:scale-95"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={14} />}
                  {editingId ? "Cập Nhật" : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
