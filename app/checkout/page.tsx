"use client";

import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Package, Truck, CreditCard, CheckCircle2, ShoppingBag, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart, replaceCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Hồ Chí Minh",
    paymentMethod: "COD"
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/user/profile");
          const data = await response.json();
          if (response.ok && data.user) {
            setShippingInfo(prev => ({
              ...prev,
              name: data.user.name || "",
              phone: data.user.phone || "",
              address: data.user.address || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching user data for checkout:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  // Validate cart on page load
  useEffect(() => {
    const validateCart = async () => {
      if (cart.length === 0) {
        setIsValidating(false);
        return;
      }

      try {
        const res = await fetch("/api/cart/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart })
        });

        if (!res.ok) {
          setIsValidating(false);
          return;
        }

        const data = await res.json();
        const errors: string[] = [];

        // Report removed items
        if (data.removedItems?.length > 0) {
          data.removedItems.forEach((item: any) => {
            errors.push(`❌ "${item.name}" — ${item.reason}`);
          });
        }

        // Report adjusted quantities
        if (data.validatedItems?.length > 0) {
          data.validatedItems.forEach((item: any) => {
            if (item.quantityAdjusted) {
              errors.push(`⚠️ "${item.name}" — Số lượng giảm xuống ${item.quantity} (kho chỉ còn ${item.maxStock})`);
            }
          });
        }

        // Replace cart with validated items
        if (data.validatedItems) {
          const newCart = data.validatedItems.map((item: any) => ({
            id: `${item.productId}-${item.leftPower}-${item.rightPower}`,
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            leftPower: item.leftPower,
            rightPower: item.rightPower,
          }));
          replaceCart(newCart);
        }

        setValidationErrors(errors);
      } catch (error) {
        console.error("Cart validation error:", error);
      } finally {
        setIsValidating(false);
      }
    };

    validateCart();
  }, []); // Run once on mount

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalAmount: totalPrice,
          shippingInfo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi");
      }

      setOrderId(data.orderId);
      setOrderNumber(data.orderNumber);
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      if (err.message.includes("không tồn tại") || err.message.includes("đã bị xóa")) {
        if (confirm(`${err.message}\n\nBạn có muốn xóa hết giỏ hàng để bắt đầu lại không?`)) {
          clearCart();
          router.push("/products");
        }
      } else {
        alert(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[160px] pb-24 px-4">
        <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-md shadow-lg border border-teal-100">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 border-2 border-teal-100">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Đặt hàng thành công!</h1>
          <p className="text-gray-500 mb-4">Cảm ơn bạn đã tin tưởng Kilala Eye. Mã đơn hàng của bạn là:</p>
          <div className="bg-gray-50 py-3 px-6 rounded-md font-black text-xl text-teal-600 mb-8 inline-block border border-gray-100">
            #{orderNumber}
          </div>
          <p className="text-sm text-gray-400 mb-10 max-w-md mx-auto italic">
            Chúng tôi sẽ liên hệ sớm để xác nhận đơn hàng của bạn. 
            Hệ thống đang xử lý và chuẩn bị giao hàng sớm nhất có thể.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="px-8 py-4 bg-teal-600 text-white rounded-md font-bold uppercase tracking-widest text-xs hover:bg-teal-700 transition-all shadow-md active:scale-95"
            >
              Theo dõi đơn hàng
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-white text-gray-900 rounded-md font-bold uppercase tracking-widest text-xs border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while validating cart
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[160px] pb-24 px-4 flex items-start justify-center">
        <div className="bg-white p-12 rounded-md shadow-sm border border-gray-100 text-center mt-20">
          <Loader2 className="animate-spin text-teal-600 mx-auto mb-4" size={40} />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Đang kiểm tra giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[160px] pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-teal-600 mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Quay lại giỏ hàng
        </Link>
        <h1 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">Thanh Toán</h1>

        {/* Validation warnings */}
        {validationErrors.length > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-black text-amber-800 text-sm uppercase tracking-tight mb-2">Giỏ hàng đã được cập nhật</p>
                <ul className="space-y-1">
                  {validationErrors.map((err, i) => (
                    <li key={i} className="text-xs text-amber-700 font-medium">{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Checkout Form */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
                <Truck className="text-teal-600" /> Thông tin giao hàng
              </h2>
              <form onSubmit={handleCheckout} id="checkout-form" className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Họ và tên người nhận</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm font-bold transition-all placeholder:text-gray-300"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm font-bold transition-all placeholder:text-gray-300"
                        placeholder="09xxx..."
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Địa chỉ nhận hàng</label>
                    <textarea
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      rows={2}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm font-bold transition-all resize-none placeholder:text-gray-300"
                      placeholder="Số nhà, Tên đường..."
                    />
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Thành phố / Tỉnh</label>
                    <select
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm font-bold transition-all"
                    >
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                    </select>
                 </div>
              </form>
            </div>

            <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
                <CreditCard className="text-teal-600" /> Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                 <label className={`flex items-center justify-between p-4 rounded-md border-2 transition-all cursor-pointer ${shippingInfo.paymentMethod === 'COD' ? 'border-teal-600 bg-teal-50' : 'border-gray-50 bg-gray-50 hover:border-gray-100'}`}>
                    <div className="flex items-center gap-4">
                       <input 
                         type="radio" 
                         name="payment" 
                         className="hidden" 
                         checked={shippingInfo.paymentMethod === 'COD'} 
                         onChange={() => setShippingInfo({...shippingInfo, paymentMethod: 'COD'})}
                       />
                       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${shippingInfo.paymentMethod === 'COD' ? 'border-teal-600' : 'border-gray-300'}`}>
                          {shippingInfo.paymentMethod === 'COD' && <div className="w-2 h-2 bg-teal-600 rounded-full" />}
                       </div>
                       <div>
                          <p className="text-sm font-black text-gray-900 uppercase">Thanh toán khi nhận hàng (COD)</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic mt-0.5">Phí thu hộ miễn phí</p>
                       </div>
                    </div>
                 </label>
                 
                 <label className={`flex items-center justify-between p-4 rounded-md border-2 transition-all cursor-not-allowed opacity-50 ${shippingInfo.paymentMethod === 'BANK' ? 'border-teal-600 bg-teal-50' : 'border-gray-50 bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-4 h-4 rounded-full border-2 border-gray-300`} />
                       <div>
                          <p className="text-sm font-black text-gray-400 uppercase">Chuyển khoản ngân hàng</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic mt-0.5">Sắp ra mắt</p>
                       </div>
                    </div>
                 </label>
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-white p-8 rounded-md shadow-lg border border-gray-200 sticky top-[160px]">
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight pb-4 border-b border-gray-100">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-gray-50 rounded border border-gray-100 overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-gray-900 truncate uppercase mt-0.5">{item.name}</h4>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">SL: x{item.quantity}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-black uppercase">L: {item.leftPower}</span>
                        <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-black uppercase">R: {item.rightPower}</span>
                      </div>
                    </div>
                    <p className="text-sm font-black text-teal-600 mt-0.5">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Tạm tính ({totalItems} món)</span>
                  <span className="font-black text-gray-900 text-sm">{totalPrice.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-bold text-[10px] text-gray-400 uppercase tracking-widest">Phí vận chuyển</span>
                  <span className="font-black text-teal-600 text-sm italic">MIỄN PHÍ</span>
                </div>
                <div className="pt-4 border-t-2 border-dashed border-gray-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-black text-gray-900 uppercase tracking-tight">Tổng thanh toán</span>
                    <span className="text-3xl font-black text-teal-600 tracking-tighter">
                      {totalPrice.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="w-full py-5 bg-[#111312] text-white rounded-md font-black uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Đang xử lý đơn hàng...
                  </div>
                ) : (
                  "XÁC NHẬN ĐẶT HÀNG"
                )}
              </button>
              
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-6">
                 <Package className="text-gray-200" size={32} />
                 <Truck className="text-gray-200" size={32} />
                 <CreditCard className="text-gray-200" size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
