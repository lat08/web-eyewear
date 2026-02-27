"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const { totalItems } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navigation = [
    { name: "Lens 1 Ngày", href: "/products?category=lens-1-ngay" },
    { name: "Lens 1 Tháng", href: "/products?category=lens-1-thang" },
    { name: "Lens 6 Tháng", href: "/products?category=lens-6-thang" },
    { name: "Phụ Kiện", href: "/products?category=phu-kien" },
    { name: "Chính sách bảo hành", href: "/warranty" },
    { name: "Liên hệ", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl lg:text-3xl font-bold text-teal-600 uppercase tracking-tight">
              Kilala <span className="text-teal-800">Eye</span>
            </span>
          </Link>

          {/* Top Right Text */}
          <div className="hidden md:block flex-1 max-w-md mx-auto text-center">
            <p className="text-[13px] text-gray-500 hover:text-teal-600 cursor-pointer transition-colors font-medium">
              Lần đầu tiên ghé Kilala? Tìm lens phù hợp ngay »
            </p>
          </div>

          {/* Search, Cart, Profile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search */}
            <button
              className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={22} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-teal-600 transition-colors relative"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-0.5 bg-teal-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="group relative">
              <div className="p-2 text-gray-600 hover:text-teal-600 transition-colors cursor-pointer">
                <User size={22} />
              </div>
              
              <div className="absolute top-full right-0 mt-1 w-48 bg-white shadow-xl rounded-md border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {!session ? (
                  <>
                    <Link href="/login" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 font-bold uppercase tracking-wide transition-colors">
                      Đăng Nhập
                    </Link>
                    <Link href="/register" className="block px-4 py-2.5 text-sm text-teal-600 hover:bg-teal-50 font-bold uppercase tracking-wide transition-colors">
                      Đăng Ký
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs text-gray-500">Xin chào,</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{session.user?.name}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-semibold transition-colors">Tài khoản của tôi</Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-semibold transition-colors">Đơn hàng đã mua</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar (Expandable) */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 animate-slideDown border-t border-gray-200 z-50">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tròng kính, kính râm..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 font-medium"
              autoFocus
            />
            <button 
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-bold uppercase tracking-widest text-xs"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="bg-teal-50 border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center h-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.href === "/#contact" && window.location.pathname === "/") {
                    e.preventDefault();
                    const element = document.getElementById("contact");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
                className="px-4 py-2 text-sm text-teal-800 hover:text-teal-600 font-medium transition-colors border-r border-teal-200 last:border-r-0"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center justify-between h-12">
            <button
              className="p-2 text-teal-700 hover:text-teal-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-teal-700">Menu</span>
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
                className="block py-3 text-teal-800 hover:text-teal-600 font-medium border-b border-gray-100"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (item.href === "/#contact" && window.location.pathname === "/") {
                    e.preventDefault();
                    const element = document.getElementById("contact");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
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
