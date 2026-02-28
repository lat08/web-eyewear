"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";

// React 19 compatible editor
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type PostFormProps = {
  initialData?: any;
};

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    isPublished: initialData?.isPublished ?? true,
  });

  const generateSlug = (title: string) => {
    const slug = title.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
    setFormData({ ...formData, title, slug });
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
    setLoading(true);

    try {
      const url = initialData ? `/api/admin/posts/${initialData.id}` : "/api/admin/posts";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (error: any) {
      alert(`Lỗi lưu bài viết: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 bg-gray-50/80 backdrop-blur-md py-4 border-b border-gray-200 -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/posts" 
            className="p-2.5 bg-white rounded-md border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all hover:shadow-md group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h2 className="text-2xl font-black uppercase text-gray-900 tracking-tighter">
              {initialData ? "Sửa Bài Viết" : "Viết Bài Mới"}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">Content Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
             href="/admin/posts"
             className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
          >
            Hủy Bỏ
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-black transition-all font-black uppercase tracking-widest shadow-xl shadow-gray-200 disabled:opacity-50 active:scale-95"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {initialData ? "Cập Nhật" : "Xuất Bản"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Base Info */}
          <div className="bg-white p-8 rounded-md border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs border-b border-gray-100 pb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-600" /> Nội Dung Cơ Bản
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Tiêu Đề Bài Viết <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => generateSlug(e.target.value)}
                    className="w-full px-4 py-4 text-xl font-black border border-gray-100 bg-gray-50/30 rounded-md focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all text-gray-900 placeholder:text-gray-300"
                    placeholder="VD: Xu hướng thời trang mắt kính 2026..."
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Đường Dẫn URL (Tự động) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-md focus:bg-white focus:border-teal-500 transition-all text-xs font-mono text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Tóm Tắt Ngắn (Excerpt)</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-md focus:bg-white focus:border-teal-500 transition-all text-sm resize-none font-medium text-gray-600"
                  placeholder="Viết một đoạn ngắn giới thiệu bài viết để thu hút người đọc..."
                />
              </div>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="bg-white p-8 rounded-md border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs border-b border-gray-100 pb-3">Nội Dung Chi Tiết</h3>
            <div className="h-[500px] mb-12 blog-editor">
              <ReactQuill 
                theme="snow" 
                value={formData.content} 
                onChange={(val) => setFormData({...formData, content: val})} 
                className="h-full"
                placeholder="Bắt đầu viết nội dung bài viết tại đây..."
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'image', 'video'],
                    ['clean']
                  ],
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          {/* Publication Status */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs border-b border-gray-100 pb-3">Xuất Bản</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 border border-gray-100 rounded-md cursor-pointer hover:bg-gray-50 transition-all group">
                <div className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${formData.isPublished ? 'bg-teal-600 border-teal-600' : 'bg-white border-gray-200'}`}>
                   {formData.isPublished && <Check size={14} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                />
                <div>
                  <p className="font-black text-[11px] text-gray-900 uppercase tracking-widest">Trạng Thái Công Khai</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formData.isPublished ? "Người dùng có thể đọc bài này" : "Lưu dưới dạng bản nháp"}</p>
                </div>
              </label>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Chuyên Mục</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-md focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all text-xs font-black uppercase tracking-widest"
                >
                  <option value="">-- CHỌN CHUYÊN MỤC --</option>
                  <option value="Tin Tức">Tin Tức</option>
                  <option value="Khuyến Mãi">Khuyến Mãi</option>
                  <option value="Góc Nhìn">Góc Nhìn</option>
                  <option value="Kiến Thức">Kiến Thức</option>
                  <option value="Sản Phẩm">Sản Phẩm</option>
                </select>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs border-b border-gray-100 pb-3">Ảnh Đại Diện</h3>
            
            <div className="space-y-4">
              <div 
                className="group relative w-full h-56 border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center bg-gray-50 overflow-hidden transition-all hover:bg-gray-100/50 hover:border-gray-300"
              >
                 {formData.image ? (
                   <>
                     <Image src={formData.image} alt="Featured" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 bg-white text-gray-900 rounded-full hover:bg-teal-600 hover:text-white transition-all shadow-xl"
                        >
                          <Upload size={18} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, image: ""})}
                          className="p-3 bg-white text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition-all shadow-xl"
                        >
                          <X size={18} />
                        </button>
                     </div>
                   </>
                 ) : (
                   <button 
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-teal-600 transition-colors"
                   >
                     <div className="p-4 bg-white rounded-full shadow-sm">
                       <Upload size={24} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Tải ảnh đại diện</span>
                   </button>
                 )}
                 
                 {uploading && (
                   <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2">
                     <Loader2 className="animate-spin text-teal-600" size={32} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">Đang tải lên...</span>
                   </div>
                 )}
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={onFileChange} 
              />

              <div className="pt-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hoặc dán URL ảnh</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-md focus:bg-white focus:border-teal-500 transition-all text-[11px] font-medium"
                />
              </div>

               <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-md border border-amber-100 mt-4">
                  <AlertCircle size={14} className="text-amber-600 shrink-0" />
                  <p className="text-[9px] text-amber-700 leading-tight">Sử dụng ảnh tỉ lệ 16:9 để hiển thị tốt nhất trên blog cá nhân.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .blog-editor .ql-container {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          background: #fcfcfc;
        }
        .blog-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-color: #f3f4f6;
          background: #ffffff;
        }
        .blog-editor .ql-editor {
          min-height: 400px;
          line-height: 1.8;
          color: #374151;
        }
        .blog-editor .ql-editor.ql-blank::before {
          font-style: italic;
          color: #d1d5db;
        }
      `}</style>
    </form>
  );
}
