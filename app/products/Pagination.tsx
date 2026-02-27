"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(pathname + "?" + params.toString());
    
    // Optional: scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-16 pb-8">
      <button
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="p-2 border border-gray-200 rounded-md text-gray-500 bg-white hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        aria-label="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex gap-1.5">
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          const isCurrent = currentPage === pageNumber;
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-200 shadow-sm ${
                isCurrent
                  ? "bg-teal-600 text-white border-transparent shadow-[0_4px_10px_rgba(13,148,136,0.3)] transform scale-105"
                  : "border border-gray-200 text-gray-600 bg-white hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="p-2 border border-gray-200 rounded-md text-gray-500 bg-white hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        aria-label="Next Page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
