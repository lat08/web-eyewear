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
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    colors: ['#000000']
  },
  {
    id: 2,
    name: 'KÍNH NHỰA LILY KANE 21151',
    price: 490000,
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop',
    colors: ['#000000', '#8B4513', '#000000', '#FFC0CB', '#808080']
  },
  {
    id: 3,
    name: 'KÍNH RÂM LILY P20329',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d46?w=400&h=400&fit=crop',
    colors: ['#FFC0CB', '#800000', '#000000']
  },
  {
    id: 4,
    name: 'KÍNH NHỰA LILY 21027',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-square overflow-hidden rounded-lg group">
            <Image
              src="https://kinhmatlily.com/images/home/msg5192635164-180486.jpg"
              alt="Danh mục sản phẩm 1"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg group">
            <Image
              src="https://kinhmatlily.com/images/home/msg5192635164-180487.jpg"
              alt="Danh mục sản phẩm 2"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg group">
            <Image
              src="https://kinhmatlily.com/images/home/868d6f1a-b8d2-4be2-a328-80aa96a543d1.jfif"
              alt="Danh mục sản phẩm 3"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg group">
            <Image
              src="https://kinhmatlily.com/images/home/z5518368914193_d76e1cfd8720e2fb1a585449efd32a13.jpg"
              alt="Danh mục sản phẩm 4"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
