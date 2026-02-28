"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tags,
  ShoppingCart,
  Users,
  FileText,
  MessageSquare,
  LogOut,
  Settings
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Sản phẩm", href: "/admin/products", icon: Package },
  { name: "Danh mục", href: "/admin/categories", icon: Layers },
  { name: "Bộ sưu tập", href: "/admin/collections", icon: LayoutDashboard },
  { name: "Tags", href: "/admin/tags", icon: Tags },
  { name: "Bài viết", href: "/admin/posts", icon: FileText },
  { name: "Đánh giá", href: "/admin/reviews", icon: MessageSquare },
  { name: "Người dùng", href: "/admin/users", icon: Users }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 h-screen bg-[#111312] text-white flex-shrink-0">
      <div className="flex items-center justify-center h-20 border-b border-gray-800">
        <Link href="/admin" className="text-2xl font-black tracking-widest uppercase text-white hover:text-teal-400 transition-colors">
          KILALA<span className="text-teal-500">ADMIN</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-700">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
            const Icon = link.icon;
            
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive
                      ? "bg-teal-600/20 text-teal-400 border-r-4 border-teal-500"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
