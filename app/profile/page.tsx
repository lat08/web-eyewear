import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Package, MapPin, Phone, Mail, ChevronRight, LogOut, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import SignOutButton from "./SignOutButton";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isMain: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Đang chờ", color: "text-amber-600 bg-amber-50 border-amber-100", icon: <Clock size={14} /> };
      case "PROCESSING":
        return { label: "Đang xử lý", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Clock size={14} /> };
      case "SHIPPED":
        return { label: "Đang giao", color: "text-indigo-600 bg-indigo-50 border-indigo-100", icon: <Truck size={14} /> };
      case "DELIVERED":
        return { label: "Đã giao", color: "text-teal-600 bg-teal-50 border-teal-100", icon: <CheckCircle2 size={14} /> };
      case "CANCELLED":
        return { label: "Đã hủy", color: "text-red-600 bg-red-50 border-red-100", icon: <XCircle size={14} /> };
      default:
        return { label: status, color: "text-gray-600 bg-gray-50 border-gray-100", icon: <Clock size={14} /> };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[160px] pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-10 uppercase tracking-tight">Tài Khoản Của Tôi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - User Info */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-teal-600 border-2 border-teal-100 shadow-inner">
                  {user.image ? (
                    <Image src={user.image} alt={user.name || ""} width={96} height={96} className="rounded-full object-cover" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{user.name}</h2>
                <div className="mt-1 flex items-center justify-center gap-2 text-xs font-bold bg-teal-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                  Thành viên Kilala
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số điện thoại</p>
                    <p className="text-sm font-bold text-gray-800">{user.phone || "Chưa cập nhật"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Địa chỉ mặc định</p>
                    <p className="text-sm font-bold text-gray-800">{user.address || "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-50">
                <SignOutButton />
              </div>
            </div>

            {/* Loyalty Points / Stats */}
            <div className="bg-teal-600 p-8 rounded-md shadow-lg text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Điểm thưởng tích lũy</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter">1,250</span>
                  <span className="text-xs uppercase font-bold opacity-80">Points</span>
                </div>
                <div className="mt-6 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-2/3"></div>
                </div>
                <p className="mt-3 text-[10px] font-bold opacity-80 uppercase tracking-wide italic">Còn 750 điểm nữa để lên hạng Diamond</p>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Package size={160} />
              </div>
            </div>
          </div>

          {/* Main Content - Order History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 min-h-[600px]">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                  <Package className="text-teal-600" /> Lịch sử đơn hàng
                </h2>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  {user.orders.length} đơn hàng
                </div>
              </div>

              {user.orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                    <Package size={40} />
                  </div>
                  <p className="text-gray-500 font-medium mb-6 italic">Bạn chưa thực hiện đơn hàng nào.</p>
                  <Link href="/products" className="py-3 px-8 bg-teal-600 text-white rounded-md font-bold uppercase tracking-widest text-xs hover:bg-teal-700 transition-all shadow-md active:scale-95">
                    Khám phá sản phẩm ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {user.orders.map((order: any) => {
                    const status = getStatusInfo(order.status);
                    return (
                      <div key={order.id} className="border border-gray-100 rounded-lg overflow-hidden hover:border-teal-100 hover:shadow-md transition-all group">
                        {/* Order Meta Header */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                          <div className="flex items-center gap-6">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mã đơn hàng</p>
                              <p className="text-sm font-bold text-gray-900">#{order.orderNumber}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ngày đặt</p>
                              <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${status.color}`}>
                            {status.icon} {status.label}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6">
                          <div className="space-y-4">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex gap-4">
                                <div className="relative w-16 h-16 bg-gray-50 rounded border border-gray-100 overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.product.images[0]?.url || "/images/placeholder.jpg"}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-bold text-gray-900 truncate">{item.product.name}</h4>
                                  <div className="flex items-center gap-4 mt-1">
                                    <p className="text-[11px] text-gray-500 font-medium">SL: x{item.quantity}</p>
                                    {(item.leftPower || item.rightPower) && (
                                       <div className="flex gap-2">
                                         <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-bold uppercase">L: {item.leftPower}</span>
                                         <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-bold uppercase">R: {item.rightPower}</span>
                                       </div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm font-black text-gray-900">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                            <Link href={`/profile/orders/${order.id}`} className="text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-widest flex items-center gap-1 group/link transition-all">
                              Xem chi tiết <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                            <div className="text-right">
                              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mr-2">Tổng tiền:</span>
                              <span className="text-lg font-black text-teal-600">{order.totalAmount.toLocaleString("vi-VN")} ₫</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
