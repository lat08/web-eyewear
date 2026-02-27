"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <Link href="/" className="flex items-center hover:text-teal-600 transition-colors">
        <Home size={16} className="mr-1" />
        <span>Trang chủ</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={16} className="mx-2 text-gray-400 flex-shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-teal-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
