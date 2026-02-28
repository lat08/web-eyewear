"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Tìm kiếm nhanh (Ctrl+K)"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-500 hover:text-teal-600 transition-colors">
          <Bell size={22} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900">{(session?.user as any)?.name || "Admin User"}</p>
            <p className="text-xs text-teal-600 font-medium">{(session?.user as any)?.role || "ADMIN"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 border-2 border-teal-200 overflow-hidden">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="Avatar" width={40} height={40} className="object-cover" />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
