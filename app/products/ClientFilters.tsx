"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";

export default function ClientFilters({
  categories,
}: {
  categories: { id: number; name: string; slug: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "";
  const currentQ = searchParams.get("q") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  
  const [searchTerm, setSearchTerm] = useState(currentQ);

  // Keep search term synced if URL changes
  useEffect(() => {
    setSearchTerm(currentQ);
  }, [currentQ]);

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(paramsToUpdate).forEach(([name, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      });
      
      params.delete("page"); // Reset page when filtering
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(pathname + "?" + createQueryString({ "q": searchTerm }));
  };

  const priceRanges = [
    { label: "Tất cả mức giá", min: "", max: "" },
    { label: "Dưới 500.000₫", min: "0", max: "500000" },
    { label: "500.000₫ - 1.000.000₫", min: "500000", max: "1000000" },
    { label: "Trên 1.000.000₫", min: "1000000", max: "999999999" },
  ];

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 sticky top-[100px] flex flex-col gap-8">
      {/* Search */}
      <div>
        <h3 className="text-sm font-black text-gray-900 mb-4 tracking-widest uppercase">Tìm Kiếm</h3>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm transition-colors text-gray-700 placeholder-gray-400 bg-gray-50/50"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-teal-600 transition-colors">
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-black text-gray-900 mb-4 tracking-widest uppercase">Danh Mục</h3>
        <div className="space-y-1 px-1">
          <button
            onClick={() => router.push(pathname + "?" + createQueryString({ "category": "" }))}
            className={`flex items-center justify-between w-full text-left py-2 text-sm transition-all duration-200 group ${
              !currentCategory 
                ? "text-teal-600 font-bold" 
                : "text-gray-600 hover:text-teal-600 font-medium"
            }`}
          >
            <span>Tất cả sản phẩm</span>
            {!currentCategory && <ChevronRight size={14} />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(pathname + "?" + createQueryString({ "category": cat.slug }))}
              className={`flex items-center justify-between w-full text-left py-2 text-sm transition-all duration-200 group ${
                currentCategory === cat.slug 
                  ? "text-teal-600 font-bold" 
                  : "text-gray-600 hover:text-teal-600 font-medium"
              }`}
            >
              <span>{cat.name}</span>
              {currentCategory === cat.slug && <ChevronRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-sm font-black text-gray-900 mb-4 tracking-widest uppercase">Khoảng Giá</h3>
        <div className="space-y-1 px-1">
          {priceRanges.map((range, idx) => {
            const isActive = currentMinPrice === range.min && currentMaxPrice === range.max;
            return (
              <button
                key={idx}
                onClick={() => router.push(pathname + "?" + createQueryString({ "minPrice": range.min, "maxPrice": range.max }))}
                className={`flex items-center justify-between w-full text-left py-2 text-sm transition-all duration-200 group ${
                  isActive 
                    ? "text-teal-600 font-bold" 
                    : "text-gray-600 hover:text-teal-600 font-medium"
                }`}
              >
                <span>{range.label}</span>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

