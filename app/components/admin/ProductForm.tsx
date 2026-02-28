"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Image as ImageIcon, X, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// React 19 compatible editor
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Category = { id: number; name: string };
type Collection = { id: number; name: string };
type Tag = { id: number; name: string };

type ProductFormProps = {
  initialData?: any;
};

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [fetchingDeps, setFetchingDeps] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    price: initialData?.price?.toString() || "",
    originalPrice: initialData?.originalPrice?.toString() || "",
    stock: initialData?.stock?.toString() || "0",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId?.toString() || "",
    collectionId: initialData?.collectionId?.toString() || "",
    productLine: initialData?.productLine || "",
    isFeatured: initialData?.isFeatured || false,
    selectedTags: initialData?.tags?.map((t: any) => t.tagId) || [],
  });
  
  // Basic Image mock state (in a real app, you'd upload to cloud/S3)
  const [images, setImages] = useState<{url: string, isMain: boolean}[]>(
    initialData?.images || []
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [catRes, colRes, tagRes] = await Promise.all([
          fetch("/api/admin/categories?limit=100"),
          fetch("/api/admin/collections?limit=100"),
          fetch("/api/admin/tags?limit=100")
        ]);
        
        if (catRes.ok) { const d = await catRes.json(); setCategories(d.categories || d); }
        if (colRes.ok) { const d = await colRes.json(); setCollections(d.collections || d); }
        if (tagRes.ok) { const d = await tagRes.json(); setTags(d.tags || d); }
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingDeps(false);
      }
    };
    fetchDependencies();
  }, []);

  const generateSlug = (name: string) => {
    const slug = name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
    setFormData({ ...formData, name, slug });
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => {
      const isSelected = prev.selectedTags.includes(tagId);
      return {
        ...prev,
        selectedTags: isSelected 
          ? prev.selectedTags.filter((id: number) => id !== tagId)
          : [...prev.selectedTags, tagId]
      };
    });
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [
      ...prev, 
      { url: newImageUrl, isMain: prev.length === 0 }
    ]);
    setNewImageUrl("");
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      
      if (res.ok) {
        const uploaded: { url: string }[] = await res.json();
        
        setImages(prev => {
          const newImages = [...prev, ...uploaded.map(item => ({ 
            url: item.url, 
            isMain: false 
          }))];
          
          // If no image is set as main, set the first one
          if (newImages.length > 0 && !newImages.some(i => i.isMain)) {
            newImages[0].isMain = true;
          }
          return newImages;
        });
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải ảnh lên!");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const removed = newImages.splice(index, 1)[0];
    if (removed.isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }
    setImages(newImages);
  };

  const handleSetMainImage = (index: number) => {
    setImages(images.map((img, i) => ({
      ...img,
      isMain: i === index
    })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock, 10),
        categoryId: formData.categoryId ? parseInt(formData.categoryId, 10) : null,
        collectionId: formData.collectionId ? parseInt(formData.collectionId, 10) : null,
        images: images.length > 0 && !images.some(img => img.isMain) 
          ? images.map((img, i) => ({ ...img, isMain: i === 0 }))
          : images,
      };

      const url = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      alert(`Error saving product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDeps) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-teal-600" size={32} /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50 flex items-center justify-center">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-black uppercase text-gray-900 tracking-tight">
            {initialData ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </h2>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-md hover:bg-teal-700 transition-colors font-bold shadow-sm disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          Lưu Lại
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b border-gray-100 pb-2">Thông Tin Cơ Bản</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tên Sản Phẩm <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => generateSlug(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Đường Dẫn (Slug) <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 text-sm font-mono text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Dòng Sản Phẩm</label>
                <input
                  type="text"
                  value={formData.productLine}
                  onChange={(e) => setFormData({...formData, productLine: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 text-sm"
                  placeholder="VD: Silicone Hydrogel"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b border-gray-100 pb-2">Giá & Kho</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Giá Bán <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Giá Cũ (Gốc)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 text-sm line-through text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tồn Kho <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b border-gray-100 pb-2 mb-4">Mô Tả Sản Phẩm</h3>
            <div className="h-96 mb-12">
              <ReactQuill 
                theme="snow" 
                value={formData.description} 
                onChange={(val) => setFormData({...formData, description: val})} 
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image', 'clean'],
                    [{ 'color': [] }, { 'background': [] }],
                  ],
                }}
                className="h-80"
              />
            </div>
          </div>
          
          {/* Image Upload Area */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b border-gray-100 pb-2">Hình Ảnh Sản Phẩm</h3>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  const event = { target: { files } } as any;
                  onFileChange(event);
                }
              }}
              className="border-2 border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center gap-3 hover:border-teal-500 hover:bg-teal-50/10 transition-all cursor-pointer group"
            >
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={onFileChange}
              />
              <div className="p-4 bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-teal-600 rounded-full transition-all shadow-sm">
                {uploading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
              </div>
              <div className="text-center">
                <p className="font-black text-sm text-gray-700">Kéo thả hoặc nhấp để tải ảnh lên</p>
                <p className="text-xs text-gray-400 mt-1">Hỗ trợ PNG, JPG, WEBP (Tối đa 5MB/ảnh)</p>
              </div>
            </div>

            {/* Manual URL input as fallback hidden or keep if user wants, but better to simplify */}
            <details className="mt-4">
               <summary className="text-[10px] text-gray-400 cursor-pointer hover:text-gray-600 uppercase font-bold tracking-widest">
                 Hoặc nhập URL thủ công
               </summary>
               <div className="flex gap-2 mt-2">
                 <input
                   type="text"
                   placeholder="Dán link ảnh tại đây..."
                   value={newImageUrl}
                   onChange={(e) => setNewImageUrl(e.target.value)}
                   className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 text-sm"
                 />
                 <button 
                   type="button" 
                   onClick={handleAddImage}
                   className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-200 flex items-center gap-2"
                 >
                   Thêm
                 </button>
               </div>
            </details>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                {images.map((img, idx) => (
                  <div key={idx} className={`relative group border-2 rounded-lg overflow-hidden h-36 ${img.isMain ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-gray-100'}`}>
                    <Image src={img.url} alt="Product" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                      {!img.isMain && (
                        <button 
                          type="button"
                          onClick={() => handleSetMainImage(idx)}
                          className="bg-teal-500 text-white text-[10px] px-3 py-1 rounded font-black uppercase tracking-widest"
                        >
                          Làm ảnh chính
                        </button>
                      )}
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {img.isMain && (
                      <div className="absolute top-2 left-2 bg-teal-500 text-white text-[9px] uppercase font-black px-2 py-1 rounded-md shadow-sm tracking-tighter">
                        Ảnh bìa
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b border-gray-100 pb-2">Trạng Thái</h3>
            
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
              />
              <div>
                <p className="font-bold text-gray-900 text-sm">Sản phẩm nổi bật</p>
                <p className="text-xs text-gray-500">Sẽ được xuất hiện trên trang chủ</p>
              </div>
            </label>
          </div>

          {/* Organization */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b border-gray-100 pb-2">Phân Loại Tổ Chức</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Danh Mục</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="">-- Trống --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bộ Sưu Tập</label>
              <select
                value={formData.collectionId}
                onChange={(e) => setFormData({...formData, collectionId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="">-- Trống --</option>
                {collections.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Thẻ (Tags)</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                  const isSelected = formData.selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 rounded-full border text-xs font-bold transition-colors ${
                        isSelected 
                        ? "bg-teal-50 border-teal-200 text-teal-700" 
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </form>
  );
}
