"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images }: { images: { id: number; url: string; isMain: boolean }[] }) {
  // Safe default to a placeholder if no images
  const safeImages = images && images.length > 0 ? images : [{ id: 0, url: "/images/default-product.jpg", isMain: true }];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4 sticky top-[100px]">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-md overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all duration-300">
        {/* Zoom on hover effect setup */}
        <div className="w-full h-full relative group cursor-zoom-in">
          <Image
            src={safeImages[activeIndex].url}
            alt="Product Image"
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-125"
          />
        </div>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-1">
          {safeImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                activeIndex === index
                  ? "border-teal-500 shadow-[0_0_0_2px_rgba(20,184,166,0.2)]"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-200"
              }`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
