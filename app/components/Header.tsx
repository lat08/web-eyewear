"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = [
    { name: "Sản phẩm", href: "/products" },
    { name: "Best seller", href: "/products?best-seller=true" },
    { name: "Chính sách bảo hành", href: "/warranty" },
    { name: "Góc Lily", href: "/blog" },
    { name: "Khách hàng", href: "/customers" },
    { name: "Tra cứu đơn", href: "/track-order" },
    { name: "Danh sách hệ thống 30+ cửa hàng", href: "/stores" },
    { name: "Khuyến mãi", href: "/promotions" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl lg:text-3xl font-bold text-black uppercase tracking-tight">
              Lily <span className="text-black/80">Eyewear</span>
            </span>
          </Link>

          {/* Top Right Text */}
          <div className="hidden md:block">
            <p className="text-sm text-gray-600 hover:text-black cursor-pointer transition-colors">
              Lần đầu tiên ghé Lily? Tìm kính phù hợp ngay »
            </p>
          </div>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              className="p-2 text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-black transition-colors relative"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                1
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar (Expandable) */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 animate-slideDown border-t border-gray-200">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              autoFocus
            />
            <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors font-medium">
              Tìm kiếm
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center h-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm text-gray-700 hover:text-black font-medium transition-colors border-r border-gray-200 last:border-r-0"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center justify-between h-12">
            <button
              className="p-2 text-gray-600 hover:text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700">Menu</span>
            <div></div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-gray-700 hover:text-black font-medium border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
