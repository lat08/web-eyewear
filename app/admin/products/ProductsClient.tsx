"use client";

import { useState, useEffect, Fragment } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Loader2, 
  Image as ImageIcon, 
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  RefreshCw,
  Package,
  AlertTriangle,
  Layers,
  BarChart3,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  category?: { name: string };
  collection?: { name: string };
  images: { url: string }[];
};

type Category = {
  id: number;
  name: string;
};

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockStatus, setStockStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    outOfStockCount: 0
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories?limit=100"); // Get more for the dropdown
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/products?search=${encodeURIComponent(searchQuery)}&categoryId=${categoryFilter}&stockStatus=${stockStatus}&page=${currentPage}&limit=10`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.total);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter, stockStatus, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, stockStatus]);

  const handleDelete = async (id: number) => {
    if (!confirm("CẢNH BÁO: Xóa sản phẩm sẽ xóa hết hình ảnh và đánh giá liên quan! Bạn chắc chứ?")) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      } else {
        const err = await res.text();
        alert(`Lỗi xóa: ${err}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("ALL");
    setStockStatus("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-md group-hover:scale-110 transition-transform">
            <Package size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng sản phẩm</p>
            <p className="text-3xl font-black text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-md group-hover:scale-110 transition-transform">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Hết hàng</p>
            <p className="text-3xl font-black text-gray-900">{stats.outOfStockCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-md group-hover:scale-110 transition-transform">
            <Layers size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Danh mục</p>
            <p className="text-3xl font-black text-gray-900">{stats.totalCategories}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header & Controls */}
        <div className="p-6 border-b border-gray-100 space-y-5">
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
            <div className="relative w-full xl:w-[450px]">
              <input
                type="text"
                placeholder="Tìm tên sản phẩm hoặc mã slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-transparent rounded-md focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-sm font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              {/* Category Filter */}
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-bold text-gray-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none min-w-[160px]"
              >
                <option value="ALL">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* Stock Status Filter */}
              <div className="flex items-center bg-gray-100 p-1 rounded-md">
                 <button 
                   onClick={() => setStockStatus("ALL")}
                   className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${stockStatus === 'ALL' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Tất cả
                 </button>
                 <button 
                   onClick={() => setStockStatus("IN_STOCK")}
                   className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${stockStatus === 'IN_STOCK' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Còn hàng
                 </button>
                 <button 
                   onClick={() => setStockStatus("OUT_OF_STOCK")}
                   className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${stockStatus === 'OUT_OF_STOCK' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   Hết hàng
                 </button>
              </div>

              <Link
                href="/admin/products/new"
                className="ml-auto xl:ml-0 flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-md hover:bg-black transition-all shadow-lg shadow-gray-200 text-sm font-black uppercase tracking-widest"
              >
                <Plus size={18} />
                <span>Mới</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">ID</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Sản Phẩm</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Phân Loại</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Giá Bán</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Tồn Kho</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Nổi Bật</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <Loader2 className="animate-spin text-teal-600" size={40} />
                        <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-600/50" size={16} />
                      </div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang kiểm kê kho hàng...</p>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-5 bg-gray-50 rounded-full text-gray-200">
                        <Search size={48} />
                      </div>
                      <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Không tìm thấy sản phẩm nào</p>
                      <button onClick={resetFilters} className="text-teal-600 font-bold text-sm hover:underline mt-2">Xóa tất cả bộ lọc</button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-gray-300">#{product.id}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden relative shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {product.images?.[0]?.url ? (
                            <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-black text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">{product.name}</div>
                          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter mt-1">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black uppercase border border-blue-100 w-fit">
                          {product.category?.name || "Uncategorized"}
                        </span>
                        {product.collection && (
                          <span className="inline-flex px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-black uppercase border border-purple-100 w-fit">
                            {product.collection.name}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-gray-900 text-base italic">{product.price.toLocaleString('vi-VN')}<span className="text-[10px] not-italic ml-0.5 text-gray-400">₫</span></span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'}`} />
                        <span className={`text-xs font-black ${product.stock > 0 ? 'text-gray-900' : 'text-rose-600 uppercase tracking-tighter'}`}>
                          {product.stock > 0 ? `${product.stock} sp` : "Hết hàng"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className={`p-2 rounded-full w-fit mx-auto transition-all ${product.isFeatured ? 'bg-amber-50 text-amber-500 shadow-inner' : 'bg-gray-50 text-gray-200'}`}>
                        <Star size={16} className={product.isFeatured ? "fill-current" : ""} />
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-10 xl:opacity-100 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-md transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-md transition-all"
                          title="Xóa"
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
        {!loading && products.length > 0 && (
          <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-gray-50/30 gap-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Hiển thị <span className="text-gray-900">{products.length}</span> trên {totalProducts} sản phẩm
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-all disabled:opacity-30 disabled:hover:border-gray-200 shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1.5 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, i, arr) => (
                    <Fragment key={p}>
                      {i > 0 && arr[i-1] !== p - 1 && <span className="text-gray-300 font-bold px-1">...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md text-xs font-black transition-all ${
                          currentPage === p
                            ? "bg-teal-600 text-white shadow-xl shadow-teal-100"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-teal-500 hover:text-teal-600 shadow-sm"
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
                className="p-2.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition-all disabled:opacity-30 disabled:hover:border-gray-200 shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

