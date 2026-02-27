"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 text-gray-600 rounded-md font-bold text-sm hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-all uppercase tracking-widest"
    >
      <LogOut size={18} /> Đăng xuất
    </button>
  );
}
