"use client";

import { useState, useEffect, Fragment } from "react";
import { 
  Search, 
  Loader2, 
  Eye, 
  Truck, 
  PackageCheck, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  X,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import Image from "next/image";

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    slug: string;
    images: { url: string }[];
  }
};

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user?: { name: string, email: string };
  _count?: { items: number };
  items?: OrderItem[];
};

const statusColors: any = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
};

const statusLabels: any = {
  PENDING: "Chờ Xác Nhận",
  PROCESSING: "Đang Xử Lý",
  SHIPPED: "Đang Giao",
  DELIVERED: "Đã Giao Hàng",
  CANCELLED: "Đã Hủy",
  COMPLETED: "Hoàn Tất",
};

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [globalStats, setGlobalStats] = useState({ totalRevenue: 0, pendingCount: 0 });
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders?search=${encodeURIComponent(searchQuery)}&status=${statusFilter}&page=${currentPage}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
        setTotalOrders(data.total);
        setGlobalStats(data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, currentPage]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // ESC key to close modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) setIsModalOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isModalOpen]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert("Lỗi cập nhật trạng thái");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewOrder = async (orderId: string) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (res.ok) {
        setSelectedOrder(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-md">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng Đơn Hàng</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-md">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Chờ Xác Nhận</p>
            <p className="text-2xl font-bold text-gray-900">
              {globalStats.pendingCount}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-md">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tổng Doanh Thu</p>
            <p className="text-2xl font-bold text-gray-900">
              {globalStats.totalRevenue.toLocaleString('vi-VN')}₫
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-md">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Đơn Online</p>
            <p className="text-2xl font-bold text-gray-900">
              {orders.filter(o => o.paymentStatus === "PAID").length}*
              <span className="text-xs font-normal text-gray-400 ml-1">(trang này)</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar & Filters */}
        <div className="p-5 border-b border-gray-100 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Tìm mã đơn, tên hoặc email khách..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 mr-2 text-sm font-medium text-gray-500">
                <Filter size={16} />
                <span>Trạng thái:</span>
              </div>
              {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "COMPLETED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    statusFilter === status
                      ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-teal-500 hover:text-teal-600"
                  }`}
                >
                  {status === "ALL" ? "Tất cả" : statusLabels[status]}
                </button>
              ))}
              {(searchQuery || statusFilter !== "ALL") && (
                <button 
                  onClick={resetFilters}
                  className="ml-2 p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all"
                  title="Xóa bộ lọc"
                >
                  <RefreshCw size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">Mã Đơn Hàng</th>
                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px]">Khách Hàng</th>
                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px] text-center">Sản Phẩm</th>
                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px] text-right">Tổng Tiền</th>
                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px] text-center">Trạng Thái</th>
                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px] text-center">Ngày Tạo</th>
                <th className="px-6 py-4 font-semibold text-gray-600 uppercase tracking-wider text-[11px] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-teal-600" size={32} />
                      <p className="text-gray-500 font-medium tracking-wide">Đang lấy dữ liệu đơn hàng...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                        <AlertCircle size={40} />
                      </div>
                      <p className="text-gray-500 font-medium">Không tìm thấy đơn hàng nào khớp với bộ lọc.</p>
                      <button onClick={resetFilters} className="text-teal-600 hover:underline text-sm font-bold mt-2">
                        Xóa tất cả bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{order.user?.name || "Khách Vãng Lai"}</span>
                        <span className="text-[11px] text-gray-400 lowercase">{order.user?.email || "No email"}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-gray-100">
                        {order._count?.items || 0} món
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-black text-gray-900">{order.totalAmount?.toLocaleString('vi-VN')}₫</span>
                        <span className={`text-[10px] font-bold uppercase ${order.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'COD'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusColors[order.status] || "bg-gray-100 border-gray-200"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleViewOrder(order.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-teal-600 border border-teal-100 rounded-md hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-sm group-hover:shadow-teal-100"
                      >
                        <Eye size={14} />
                        <span className="text-xs font-bold">Chi tiết</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-sm text-gray-500">
              Hiển thị <span className="font-bold text-gray-900">{orders.length}</span> đơn hàng (Tổng cộng: {totalOrders})
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 border border-gray-200 rounded-md hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-400"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, i, arr) => (
                    <Fragment key={p}>
                      {i > 0 && arr[i-1] !== p - 1 && <span className="text-gray-300">...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-bold transition-all ${
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
                className="p-2 border border-gray-200 rounded-md hover:bg-white hover:border-teal-500 hover:text-teal-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-400"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal - Enhanced Detail View */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md transition-all">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
            {modalLoading || !selectedOrder ? (
              <div className="p-32 text-center">
                <Loader2 className="animate-spin mx-auto text-teal-600 mb-4" size={48} />
                <p className="text-gray-500 font-medium">Đang tải chi tiết đơn hàng...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-gray-200 rounded-md shadow-sm text-teal-600">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Chi Tiết Đơn Hàng</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-tighter ${statusColors[selectedOrder.status]}`}>
                          {statusLabels[selectedOrder.status]}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-widest">{selectedOrder.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-gray-700 hover:shadow-md transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 bg-white space-y-8 scroll-smooth">
                  
                  {/* Status Pipeline - Enhanced */}
                  <div>
                    <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2">
                      <RefreshCw size={14} className="text-teal-600" />
                      Cập Nhật Trạng Thái
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'PROCESSING', icon: Clock, label: 'Đang Xử Lý', color: 'hover:border-blue-500 hover:text-blue-600 active:bg-blue-600' },
                        { id: 'SHIPPED', icon: Truck, label: 'Đang Giao', color: 'hover:border-indigo-500 hover:text-indigo-600 active:bg-indigo-600' },
                        { id: 'DELIVERED', icon: PackageCheck, label: 'Đã Giao', color: 'hover:border-emerald-500 hover:text-emerald-600 active:bg-emerald-600' },
                        { id: 'COMPLETED', icon: CheckCircle2, label: 'Hoàn Tất', color: 'hover:border-green-500 hover:text-green-600 active:bg-green-600' }
                      ].map((step) => (
                        <button 
                          key={step.id}
                          onClick={() => handleUpdateStatus(selectedOrder.id, step.id)} 
                          className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-md text-xs font-black transition-all shadow-sm ${
                            selectedOrder.status === step.id 
                              ? 'bg-teal-600 border-teal-600 text-white shadow-teal-200' 
                              : `bg-white border-gray-200 text-gray-600 ${step.color}`
                          }`}
                        >
                          <step.icon size={16} /> 
                          {step.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                        <Eye size={14} className="text-teal-600" />
                        Thông Tin Khách Hàng
                      </h4>
                      <div className="p-5 border border-gray-100 rounded-lg bg-gray-50/50 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center font-black text-teal-600 text-xs shadow-sm">
                            {selectedOrder.user?.name?.charAt(0) || "K"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{selectedOrder.user?.name || "Khách vãng lai"}</p>
                            <p className="text-xs text-gray-400 lowercase">{selectedOrder.user?.email || "Không có email"}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Thanh Toán:</span>
                            <span className={`font-black uppercase tracking-wider ${selectedOrder.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {selectedOrder.paymentStatus === 'PAID' ? "Đã Thanh Toán Online" : "COD (Thanh toán khi nhận)"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Ngày đặt hàng:</span>
                            <span className="text-gray-900 font-bold">
                              {new Date(selectedOrder.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Info */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                        <CreditCard size={14} className="text-teal-600" />
                        Tổng Kết Thanh Toán
                      </h4>
                      <div className="p-5 border border-gray-100 rounded-lg bg-gray-900 text-white shadow-xl h-full flex flex-col justify-center">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Thành Tiền</p>
                        <p className="text-4xl font-black text-white italic">
                          {selectedOrder.totalAmount?.toLocaleString('vi-VN')}
                          <span className="text-xl not-italic ml-1 text-teal-400">₫</span>
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Hệ thống đã ghi nhận thành công</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 pb-4">
                    <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
                      <ShoppingBag size={14} className="text-teal-600" />
                      Sản Phẩm Trong Đơn ({selectedOrder.items?.length})
                    </h4>
                    <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-black tracking-widest">
                            <tr>
                              <th className="p-4">Sản Phẩm</th>
                              <th className="p-4 text-center">SL</th>
                              <th className="p-4 text-right">Đơn Giá</th>
                              <th className="p-4 text-right">Thành Tiền</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {selectedOrder.items?.map(item => (
                              <tr key={item.id} className="bg-white">
                                <td className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 relative overflow-hidden shrink-0 group">
                                      {item.product?.images?.[0]?.url && (
                                        <Image 
                                          src={item.product.images[0].url} 
                                          alt={item.product.name} 
                                          fill 
                                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                      )}
                                    </div>
                                    <div className="max-w-[200px]">
                                      <p className="font-black text-gray-900 text-xs line-clamp-2 leading-relaxed">{item.product?.name}</p>
                                      <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-tighter">SLUG: {item.product?.slug}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <span className="bg-gray-100 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black">
                                    {item.quantity}
                                  </span>
                                </td>
                                <td className="p-4 text-right text-xs font-bold text-gray-600">{item.price.toLocaleString('vi-VN')}₫</td>
                                <td className="p-4 text-right">
                                  <span className="text-xs font-black text-teal-600">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                       </table>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-black text-xs uppercase tracking-widest rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

