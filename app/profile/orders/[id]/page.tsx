import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, Truck, CheckCircle2, Clock, XCircle, CreditCard, ShoppingBag } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.email) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
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
  });

  if (!order) {
    redirect("/profile");
  }

  // Ensure users can only view their own orders unless they are an admin
  if (order.user?.email !== session.user.email) {
    redirect("/profile");
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Đang chờ xử lý", color: "text-amber-600 bg-amber-50 border-amber-100", icon: <Clock size={16} />, description: "Đơn hàng của bạn đang chờ xác nhận." };
      case "PROCESSING":
        return { label: "Đang xử lý", color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Clock size={16} />, description: "Hệ thống đang chuẩn bị hàng cho bạn." };
      case "SHIPPED":
        return { label: "Đang giao hàng", color: "text-indigo-600 bg-indigo-50 border-indigo-100", icon: <Truck size={16} />, description: "Đơn hàng đã được giao cho đơn vị vận chuyển." };
      case "DELIVERED":
        return { label: "Giao hàng thành công", color: "text-teal-600 bg-teal-50 border-teal-100", icon: <CheckCircle2 size={16} />, description: "Đơn hàng đã được giao thành công đến bạn." };
      case "CANCELLED":
        return { label: "Đã hủy", color: "text-red-600 bg-red-50 border-red-100", icon: <XCircle size={16} />, description: "Đơn hàng đã bị hủy." };
      default:
        return { label: status, color: "text-gray-600 bg-gray-50 border-gray-100", icon: <Clock size={16} />, description: "Trạng thái không xác định." };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  
  // Calculate subtotal
  const subtotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-[160px] pb-24 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-teal-600 mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Quay lại danh sách đơn hàng
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
              Chi tiết đơn hàng
            </h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
              #{order.orderNumber}
            </p>
          </div>
          
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-black uppercase tracking-widest shadow-sm ${statusInfo.color}`}>
            {statusInfo.icon} {statusInfo.label}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content - Items */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3 pb-4 border-b border-gray-50">
                <ShoppingBag className="text-teal-600" /> Sản phẩm đã đặt
              </h2>
              
              <div className="space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 h-24 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 group-hover:border-teal-200 transition-colors">
                      <Image
                        src={item.product.images[0]?.url || "/images/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <Link href={`/products/${item.product.slug}`} className="text-sm font-bold text-gray-900 hover:text-teal-600 transition-colors line-clamp-2 pr-4 uppercase tracking-tight leading-relaxed">
                        {item.product.name}
                      </Link>
                      
                      <div className="flex items-center flex-wrap gap-4 mt-2">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Số lượng: {item.quantity}</p>
                        {(item.leftPower || item.rightPower) && (
                           <div className="flex gap-2">
                             <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100 px-2 py-1 rounded font-black uppercase tracking-widest">L: {item.leftPower}</span>
                             <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100 px-2 py-1 rounded font-black uppercase tracking-widest">R: {item.rightPower}</span>
                           </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right py-1">
                      <p className="text-sm font-black text-gray-900">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] font-bold text-gray-400 mt-1">{item.price.toLocaleString("vi-VN")} ₫ / sp</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Tracker */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
                  <Package className="text-teal-600" /> Trạng thái đơn hàng
               </h2>
               <div className="relative pl-8 border-l-2 border-gray-100 space-y-8">
                  <div className="relative">
                     <div className="absolute -left-[41px] bg-teal-600 text-white p-1.5 rounded-full border-4 border-white shadow-sm">
                        <Package size={14} />
                     </div>
                     <p className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1">Đơn hàng đã được tạo</p>
                     <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                  </div>
                  
                  {['SHIPPED', 'DELIVERED'].includes(order.status) && (
                    <div className="relative animate-fadeIn">
                       <div className="absolute -left-[41px] bg-teal-600 text-white p-1.5 rounded-full border-4 border-white shadow-sm">
                          <Truck size={14} />
                       </div>
                       <p className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1">Đang giao hàng</p>
                       <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Đơn hàng đã được bàn giao cho đơn vị vận chuyển</p>
                    </div>
                  )}

                  {order.status === 'DELIVERED' && (
                    <div className="relative animate-fadeIn">
                       <div className="absolute -left-[41px] bg-teal-600 text-white p-1.5 rounded-full border-4 border-white shadow-sm">
                          <CheckCircle2 size={14} />
                       </div>
                       <p className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1">Giao hàng thành công</p>
                       <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-3">Kiện hàng đã được giao đến bạn</p>
                       
                       <Link 
                         href={`/products/${order.items[0]?.product.slug}`} 
                         className="inline-block mt-2 px-4 py-2 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest rounded transition-colors hover:bg-teal-100 border border-teal-100"
                       >
                         Đánh giá sản phẩm
                       </Link>
                    </div>
                  )}

                  {order.status === 'CANCELLED' && (
                    <div className="relative animate-fadeIn">
                       <div className="absolute -left-[41px] bg-red-600 text-white p-1.5 rounded-full border-4 border-white shadow-sm">
                          <XCircle size={14} />
                       </div>
                       <p className="text-sm font-bold text-red-600 uppercase tracking-tight mb-1">Đơn hàng đã hủy</p>
                       <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Đơn hàng đã bị hủy theo yêu cầu</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Sidebar - Summary & Shipping */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest pb-4 border-b border-gray-50 flex items-center gap-2">
                 <CreditCard size={18} className="text-teal-600" /> Thanh toán
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold">Tạm tính:</span>
                  <span className="font-black text-gray-900">{subtotal.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold">Phí vận chuyển:</span>
                  <span className="font-black text-teal-600 italic text-[11px] uppercase tracking-widest">Miễn phí</span>
                </div>
              </div>
              <div className="pt-4 border-t-2 border-dashed border-gray-100 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tổng tiền:</span>
                  <span className="text-2xl font-black text-teal-600">{order.totalAmount.toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-gray-400 shadow-sm">
                    <CreditCard size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phương thức thanh toán</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                       {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                    </p>
                 </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest pb-4 border-b border-gray-50 flex items-center gap-2">
                 <MapPin size={18} className="text-teal-600" /> Thông tin nhận hàng
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Người nhận</p>
                  <p className="text-sm font-bold text-gray-900">{order.shippingName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Số điện thoại</p>
                  <p className="text-sm font-bold text-gray-900">{order.shippingPhone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Địa chỉ</p>
                  <p className="text-sm font-bold text-gray-900 leading-relaxed">
                    {order.shippingAddress}<br/>
                    {order.shippingCity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
