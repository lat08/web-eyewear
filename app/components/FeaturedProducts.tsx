'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  colors: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'KÍNH RÂM LILY 6035',
    price: 230000,
    image: '/images/1.jpg',
    colors: ['#000000']
  },
  {
    id: 2,
    name: 'KÍNH NHỰA LILY KANE 21151',
    price: 490000,
    image: '/images/2.jpg',
    colors: ['#000000', '#8B4513', '#000000', '#FFC0CB', '#808080']
  },
  {
    id: 3,
    name: 'KÍNH RÂM LILY P20329',
    price: 250000,
    image: '/images/3.jfif',
    colors: ['#FFC0CB', '#800000', '#000000']
  },
  {
    id: 4,
    name: 'KÍNH NHỰA LILY 21027',
    price: 145000,
    image: '/images/4.jpg',
    colors: ['#000000', '#FFD700']
  }
];

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Chọn kính thời trang - Nhớ tới Lily
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="text-2xl font-bold text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                    {product.id === 1 ? '6035' : product.id === 2 ? '21151' : product.id === 3 ? 'P20329' : '21027'}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-red-600 font-bold mb-3">
                  {product.price.toLocaleString()} ₫
                </p>

                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                      title={`Màu ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <button className="px-6 py-2 border border-gray-900 text-gray-900 font-medium transition-all duration-300 hover:bg-gray-900 hover:text-white">
            Xem tất cả »
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="w-48 h-0.5 bg-gray-900 mx-auto mb-4"></div>
            <h2 className="text-3xl font-bold text-gray-900">
              DANH MỤC SẢN PHẨM
            </h2>
            <div className="w-48 h-0.5 bg-gray-900 mx-auto mt-4"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Danh mục 1 */}
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500">
            <Image
              src="/images/1.jpg"
              alt="Gọng Kính Nữ"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10 transition-transform duration-500 group-hover:-translate-y-2">
              <h3 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-lg uppercase">
                Gọng Kính Nữ
              </h3>
              <div className="w-12 h-1.5 bg-yellow-400 mt-3 rounded-full transform origin-left transition-all duration-300 group-hover:w-24 shadow-sm" />
            </div>
          </div>

          {/* Danh mục 2 */}
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500">
            <Image
              src="/images/2.jpg"
              alt="Gọng Kính Nam"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10 transition-transform duration-500 group-hover:-translate-y-2">
              <h3 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-lg uppercase">
                Gọng Kính Nam
              </h3>
              <div className="w-12 h-1.5 bg-yellow-400 mt-3 rounded-full transform origin-left transition-all duration-300 group-hover:w-24 shadow-sm" />
            </div>
          </div>

          {/* Danh mục 3 */}
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500">
            <Image
              src="/images/3.jfif"
              alt="Kính Râm Thời Trang"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10 transition-transform duration-500 group-hover:-translate-y-2">
              <h3 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-lg uppercase">
                Kính Râm
              </h3>
              <div className="w-12 h-1.5 bg-yellow-400 mt-3 rounded-full transform origin-left transition-all duration-300 group-hover:w-24 shadow-sm" />
            </div>
          </div>

          {/* Danh mục 4 */}
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500">
            <Image
              src="/images/4.jpg"
              alt="Tròng Kính Cận"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10 transition-transform duration-500 group-hover:-translate-y-2">
              <h3 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-lg uppercase">
                Phụ Kiện Kính
              </h3>
              <div className="w-12 h-1.5 bg-yellow-400 mt-3 rounded-full transform origin-left transition-all duration-300 group-hover:w-24 shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
