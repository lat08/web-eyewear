"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";

export default function ProfileCart() {
  const { cart, totalItems, totalPrice, removeFromCart } = useCart();

  if (cart.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 mb-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
          <ShoppingBag className="text-teal-600" /> Giỏ hàng hiện tại
        </h2>
        <div className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest">
          {totalItems} sản phẩm
        </div>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 group">
            <div className="relative w-16 h-16 bg-gray-50 rounded border border-gray-100 overflow-hidden flex-shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-gray-900 truncate uppercase mt-0.5">{item.name}</h4>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">SL: x{item.quantity}</p>
                <div className="flex gap-1.5">
                   <span className="text-[9px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">L: {item.leftPower}</span>
                   <span className="text-[9px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase">R: {item.rightPower}</span>
                </div>
              </div>
            </div>
            <p className="text-sm font-black text-gray-900 mt-0.5">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
        <div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tổng giá trị giỏ hàng:</span>
           <p className="text-xl font-black text-teal-600">{totalPrice.toLocaleString("vi-VN")} ₫</p>
        </div>
        <Link 
          href="/cart" 
          className="w-full sm:w-auto px-8 py-3 bg-[#111312] text-white rounded-md font-bold uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 group"
        >
          Đến giỏ hàng <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
