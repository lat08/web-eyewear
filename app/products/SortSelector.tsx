"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export default function SortSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentSort = searchParams.get("sort") || "newest";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="mt-4 sm:mt-0 flex items-center gap-2">
      <span className="text-sm text-gray-500 font-medium">Sắp xếp:</span>
      <select 
        value={currentSort}
        onChange={(e) => router.push(pathname + "?" + createQueryString("sort", e.target.value))}
        className="border-gray-200 rounded-md text-sm bg-gray-50 text-gray-700 font-medium py-2 px-3 focus:ring-teal-500 focus:border-teal-500 cursor-pointer outline-none border transition-colors hover:border-teal-300"
      >
        <option value="newest">Mới Nhất</option>
        <option value="price_asc">Giá Tăng Dần</option>
        <option value="price_desc">Giá Giảm Dần</option>
        <option value="name_asc">Tên A-Z</option>
      </select>
    </div>
  );
}
