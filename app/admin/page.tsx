"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, ShoppingBag, TrendingUp, AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

type DashboardData = {
  metrics: {
    totalRevenue: number;
    pendingOrders: number;
    totalProducts: number;
    totalUsers: number;
  };
  lowStockItems: {
    id: number;
    name: string;
    slug: string;
    stock: number;
  }[];
  recentOrders: {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { name: string | null } | null;
  }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center p-8 min-h-screen bg-gray-50"><Loader2 className="animate-spin text-teal-600" size={32} /></div>;
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-black uppercase text-gray-900 tracking-tight">Tổng Quan Trạng Thái</h2>
      </div>
      
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={80} /></div>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Doanh Thu Tạm Tính</p>
          <p className="text-3xl font-black text-emerald-600">{data?.metrics.totalRevenue.toLocaleString('vi-VN')}₫</p>
        </div>
        
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><ShoppingBag size={80} /></div>
           <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Đơn Hàng Chờ Xác Nhận</p>
          <p className="text-3xl font-black text-orange-600">{data?.metrics.pendingOrders}</p>
        </div>
        
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp size={80} /></div>
           <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Tổng Sản Phẩm</p>
          <p className="text-3xl font-black text-teal-600">{data?.metrics.totalProducts}</p>
        </div>
        
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users size={80} /></div>
           <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Số Thành Viên</p>
          <p className="text-3xl font-black text-blue-600">{data?.metrics.totalUsers}</p>
        </div>
      </div>
      
      {/* Tables Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 pt-4">
        {/* Recent Orders */}
        <div className="col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Giao Dịch Gần Nhất</h3>
            <Link href="/admin/orders" className="text-sm text-teal-600 font-bold hover:underline flex items-center gap-1">Xem tất cả <ArrowRight size={14}/></Link>
          </div>
          <div className="p-4">
             {data?.recentOrders.length === 0 ? (
               <p className="text-gray-500 text-center py-8">Chưa có giao dịch nào gần đây.</p>
             ) : (
               <div className="space-y-4">
                  {data?.recentOrders.map(order => (
                     <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                        <div>
                           <div className="font-bold text-gray-900">{order.user?.name || "Khách vãng lai"}</div>
                           <div className="text-xs text-gray-500 font-mono mt-0.5">{order.id}</div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-orange-600">+{order.totalAmount.toLocaleString('vi-VN')}₫</div>
                           <div className="text-xs font-bold text-gray-500 mt-0.5">{order.status}</div>
                        </div>
                     </div>
                  ))}
               </div>
             )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2 text-red-600">
            <AlertTriangle size={18} />
            <h3 className="font-black uppercase tracking-widest text-sm">Cảnh Báo Hết Hàng</h3>
          </div>
          <div className="p-4">
             {data?.lowStockItems.length === 0 ? (
               <p className="text-gray-500 text-center py-8 text-sm">Tất cả sản phẩm đều đủ kho.</p>
             ) : (
               <div className="space-y-4">
                  {data?.lowStockItems.map(item => (
                     <div key={item.id} className="flex items-center justify-between p-3 border border-red-100 bg-red-50/50 rounded-lg">
                        <div>
                           <div className="font-bold text-gray-900 line-clamp-1">{item.name}</div>
                           <div className="text-xs text-gray-500 mt-0.5">Mã SP: {item.id}</div>
                        </div>
                        <div className="text-right whitespace-nowrap">
                           <span className="text-xs font-bold bg-white border border-red-200 text-red-600 px-2 py-1 rounded">
                             Còn: {item.stock} cái
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
             )}
             {data?.lowStockItems && data.lowStockItems.length > 0 && (
                <div className="mt-4 text-center">
                   <Link href="/admin/products" className="text-xs text-teal-600 font-bold hover:underline">Đi tới Kho Hàng</Link>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
