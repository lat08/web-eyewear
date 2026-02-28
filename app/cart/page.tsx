"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { data: session } = useSession();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[160px] pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white p-12 rounded-md shadow-sm border border-gray-100 inline-block min-w-[320px] sm:min-w-[500px]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <ShoppingBag size={40} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Giỏ hàng trống</h1>
            <p className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-md font-bold uppercase tracking-widest text-sm hover:bg-teal-700 transition-all shadow-md active:scale-95"
            >
              <ArrowLeft size={18} /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[160px] pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-10 uppercase tracking-tight flex items-center gap-4">
          Giỏ Hàng Của Bạn
          <span className="text-sm font-bold bg-teal-100 text-teal-700 px-3 py-1 rounded-full">{totalItems} sản phẩm</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-6 rounded-md shadow-sm border border-gray-100 flex gap-4 sm:gap-6 animate-fadeIn"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-base sm:text-lg font-black text-gray-900 hover:text-teal-600 transition-colors leading-tight"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Lens Powers Special Display */}
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trái (L):</span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          {item.leftPower === "0.00" ? "0.00 (Không cận)" : item.leftPower}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phải (R):</span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          {item.rightPower === "0.00" ? "0.00 (Không cận)" : item.rightPower}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4 sm:mt-0">
                    {/* Price */}
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400 font-medium">Đơn giá:</span>
                      <span className="text-lg font-black text-gray-900">
                        {item.price.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border-r border-gray-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border-l border-gray-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors mt-6 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Tiếp tục mua thêm sản phẩm khác
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-6 sm:p-8 rounded-md shadow-lg border border-gray-200 sticky top-[160px]">
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight pb-4 border-b border-gray-100">
                Tổng đơn hàng
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium text-sm text-gray-400 uppercase tracking-wider">Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="font-bold text-gray-900">{totalPrice.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium text-sm text-gray-400 uppercase tracking-wider">Phí vận chuyển</span>
                  <span className="font-bold text-teal-600 italic">Miễn phí</span>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-black text-gray-900 uppercase tracking-tight">Tổng cộng</span>
                    <span className="text-2xl font-black text-teal-600 tracking-tighter">
                      {totalPrice.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 italic text-right mt-1">(Đã bao gồm VAT nếu có)</p>
                </div>
              </div>

              {session?.user ? (
                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#111312] text-white rounded-md font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-xl active:scale-[0.98] inline-block text-center"
                >
                  TIẾN HÀNH THANH TOÁN
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-3 bg-amber-50 text-amber-600 rounded-md text-xs font-bold uppercase tracking-widest border border-amber-100">
                    Vui lòng đăng nhập để tiếp tục
                  </div>
                  <Link
                    href="/login?callbackUrl=/checkout"
                    className="w-full py-4 bg-teal-600 text-white rounded-md font-bold uppercase tracking-widest text-sm hover:bg-teal-700 transition-all shadow-xl active:scale-[0.98] inline-block text-center"
                  >
                    ĐĂNG NHẬP NGAY
                  </Link>
                </div>
              )}

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                  Chính sách đổi trả trong vòng 7 ngày
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                  Bảo hành độ cận trọn đời
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
