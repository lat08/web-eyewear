"use client";

import { useState, useRef, useEffect } from "react";
import { Minus, Plus, ChevronDown, CheckCircle2 } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function AddToCartForm({
  productId,
  name,
  slug,
  image,
  price,
  stock,
}: {
  productId: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
}) {
  const { addToCart } = useCart();
  const [leftPower, setLeftPower] = useState("");
  const [rightPower, setRightPower] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<"left" | "right" | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (leftRef.current && !leftRef.current.contains(event.target as Node) &&
          rightRef.current && !rightRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate powers from -0.00 to -8.00
  const powers = ["0.00"];
  for (let i = 0.5; i <= 8.0; i += 0.25) {
    powers.push("-" + i.toFixed(2));
  }

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const PowerDropdown = ({ 
    label, 
    value, 
    onChange, 
    isOpen, 
    onToggle,
    containerRef 
  }: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void,
    isOpen: boolean,
    onToggle: () => void,
    containerRef: React.RefObject<HTMLDivElement | null>
  }) => (
    <div className="relative" ref={containerRef as any}>
      <label className="block text-sm text-gray-800 mb-2 font-medium">{label}</label>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between bg-white border ${
          value === "" ? "text-gray-400 border-red-300" : "text-gray-900 border-gray-200"
        } rounded-md py-3 px-4 outline-none hover:border-black transition-colors text-base font-medium shadow-sm`}
      >
        <span>{value === "" ? "-- Chọn độ cận --" : (value === "0.00" ? "0.00 (Không cận)" : value)}</span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {powers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  onChange(p);
                  onToggle();
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors ${
                  value === p ? "bg-teal-50 text-teal-700 font-bold" : "text-gray-700"
                }`}
              >
                {p === "0.00" ? "0.00 (Không cận)" : p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const handleAddToCart = () => {
    if (leftPower === "" || rightPower === "") return;

    addToCart({
      productId,
      name,
      slug,
      image,
      price,
      quantity,
      leftPower,
      rightPower,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="mt-8">
      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <PowerDropdown
          label="Trái (Left)"
          value={leftPower}
          onChange={setLeftPower}
          isOpen={openDropdown === "left"}
          onToggle={() => setOpenDropdown(openDropdown === "left" ? null : "left")}
          containerRef={leftRef}
        />
        <PowerDropdown
          label="Phải (Right)"
          value={rightPower}
          onChange={setRightPower}
          isOpen={openDropdown === "right"}
          onToggle={() => setOpenDropdown(openDropdown === "right" ? null : "right")}
          containerRef={rightRef}
        />
      </div>

      {/* Quantity */}
      <div className="mb-8">
        <label className="block text-sm text-gray-800 mb-2 font-medium">Số lượng (Quantity)</label>
        <div className="flex items-center w-full sm:w-1/2 border border-gray-200 rounded-md bg-white">
          <button
            type="button"
            className="px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors border-r border-gray-200 disabled:opacity-50"
            onClick={handleDecrease}
            disabled={quantity <= 1}
          >
            <Minus size={18} />
          </button>
          <input
            type="text"
            className="flex-1 text-center font-medium bg-transparent outline-none text-gray-900 w-full"
            value={quantity}
            readOnly
          />
          <button
            type="button"
            className="px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors border-l border-gray-200 disabled:opacity-50"
            onClick={handleIncrease}
            disabled={quantity >= stock}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Add To Cart Button */}
      <div className="relative">
        <button
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-[4px] font-bold tracking-widest text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
            isAdded 
            ? "bg-teal-600 text-white" 
            : "bg-[#111312] text-white hover:bg-black"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={stock === 0 || leftPower === "" || rightPower === "" || isAdded}
        >
          {isAdded ? (
            <>
              <CheckCircle2 size={18} /> ĐÃ THÊM VÀO GIỎ HÀNG
            </>
          ) : (
            stock === 0 ? "TẠM HẾT HÀNG" : (leftPower === "" || rightPower === "" ? "VUI LÒNG CHỌN ĐỘ MẮT" : "ADD TO CART")
          )}
        </button>

        {isAdded && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[11px] px-3 py-1.5 rounded-md font-bold animate-bounce shadow-md">
            + {quantity} sản phẩm
          </div>
        )}
      </div>

      {/* Stock Message */}
      {stock > 0 ? (
         <div className="mt-3 text-center text-xs text-gray-400">
           Còn {stock} sản phẩm trong kho
         </div>
      ) : (
         <div className="mt-3 text-center text-xs text-red-500 font-medium">
           Tạm hết hàng
         </div>
      )}
    </div>
  );
}

