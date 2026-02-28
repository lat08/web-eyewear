"use client";

import { useState, useEffect, Fragment } from "react";
import { 
  Search, 
  Loader2, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  User as UserIcon, 
  Users, 
  Shield, 
  ShoppingBag,
  MessageSquare,
  AlertCircle,
  X,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useSession } from "next-auth/react";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number, reviews: number };
};

export default function UsersClient() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
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
    const timer = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Bạn có chắc muốn cấp quyền ${newRole} cho tài khoản này?`)) return;
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRole: newRole })
      });
      if (res.ok) fetchUsers();
      else alert(`Lỗi: ${await res.text()}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string, name: string | null) => {
    if (!confirm(`CẢNH BÁO: Xóa tài khoản ${name || id} vĩnh viễn? Hành động này không thể hoàn tác.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
      else alert(`Lỗi: ${await res.text()}`);
    } catch (error) {
      console.error(error);
    }
  };

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const totalOrders = users.reduce((acc, curr) => acc + curr._count.orders, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-md group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng Thành Viên</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-md group-hover:scale-110 transition-transform">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quản Trị Viên (Trang)</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{adminCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-md group-hover:scale-110 transition-transform">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng Đơn Hàng</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-md group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bình Luận</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight">
              {users.reduce((acc, curr) => acc + curr._count.reviews, 0)}
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
                placeholder="Tìm tên, email hoặc số điện thoại..."
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
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Người Dùng</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Liên Hệ</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Vai Trò</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Hoạt Động</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">Tham Gia</th>
                <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-teal-600" size={32} />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Đang tải thành viên...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <AlertCircle className="text-gray-200" size={48} />
                       <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Không tìm thấy người dùng nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelf = session?.user?.email === user.email;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-md bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-105 transition-transform">
                            <UserIcon size={20} />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 group-hover:text-teal-600 transition-colors uppercase tracking-tight">
                              {user.name || "Chưa cập nhật"}
                            </p>
                            {isSelf && (
                              <span className="inline-block mt-0.5 text-[9px] bg-blue-100 text-blue-700 font-black px-1.5 py-0.5 rounded uppercase tracking-widest">
                                Bạn
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-xs">{user.email || "—"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Phone size={12} className="text-gray-400" />
                          <span className="text-[10px]">{user.phone || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-50 text-purple-700 border-purple-100' 
                            : 'bg-gray-100 text-gray-600 border-transparent'
                        }`}>
                          {user.role === 'ADMIN' ? <ShieldCheck size={12} /> : <UserIcon size={12} />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-center gap-2">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Đơn:</span>
                             <span className="text-xs font-black text-gray-900">{user._count.orders}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Review:</span>
                             <span className="text-xs font-black text-gray-900">{user._count.reviews}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-400">
                          <Calendar size={12} />
                          <span className="text-[10px] font-bold">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleRole(user.id, user.role)}
                            disabled={isSelf}
                            className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-md transition-all border border-transparent hover:border-amber-100 disabled:opacity-30" 
                            title="Đổi quyền hạn"
                          >
                            <ShieldAlert size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={isSelf || user.role === 'ADMIN'}
                            className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-md transition-all border border-transparent hover:border-rose-100 disabled:opacity-30 disabled:cursor-not-allowed" 
                            title={user.role === 'ADMIN' ? "Không thể xóa quản trị viên" : "Xóa tài khoản"}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Trang <span className="text-gray-900">{currentPage}</span> / {totalPages} — {totalItems} thành viên
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
