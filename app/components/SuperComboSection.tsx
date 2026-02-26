'use client';

import Image from 'next/image';
import Link from 'next/link';

const serviceCards = [
  {
    id: 1,
    image: '/images/1.jpg',
    preTitle: 'KIỂM TRA',
    title: 'KHOẢNG CÁCH ĐỒNG TỬ',
    description: 'Hướng dẫn các bước đo PD tại nhà đơn giản và chính xác nhất',
    link: '/services/do-pd',
  },
  {
    id: 2,
    image: '/images/2.jpg',
    preTitle: '',
    title: 'HỆ THỐNG CỬA HÀNG',
    description: 'Khám phá ngay hệ thống cửa hàng offline của Lily trên toàn quốc',
    link: '/stores',
  },
  {
    id: 3,
    image: '/images/4.jpg',
    preTitle: '',
    title: 'TÌM KÍNH PHÙ HỢP',
    description: 'Dễ dàng tìm chiếc kính ứng ý với bộ lọc thông minh của Lily',
    link: '/products',
  },
];

export default function SuperComboSection() {
  return (
    <section className="py-12 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* SUPER COMBO Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-gray-100">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
              SUPER COMBO
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              <strong>SUPER COMBO</strong> là các combo tròng và gọng kính có các thông số mắt
              đã được đo sẵn, giúp bạn tiết kiệm chi phí mua sắm tối ưu so với khi mua tròng và
              gọng kính rời.
            </p>
          </div>
          <div className="text-left md:text-right">
            <Link
              href="/products?category=super-combo"
              className="group inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors uppercase tracking-widest"
            >
              <span>XEM NGAY</span>
              <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {serviceCards.map((card) => (
            <div key={card.id} className="flex flex-col group cursor-pointer">
              {/* Image Card with Overlay */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg transition-shadow duration-500 group-hover:shadow-2xl" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/50" />

                {/* Text Content over image */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6 text-center z-10 transition-transform duration-500 group-hover:-translate-y-2">
                  {card.preTitle && (
                    <p className="text-white text-sm font-semibold tracking-widest mb-2 opacity-90">
                      {card.preTitle}
                    </p>
                  )}
                  <h3 className="text-white text-2xl font-bold mb-3 leading-tight drop-shadow-md">
                    {card.title}
                  </h3>
                  <p className="text-yellow-400 text-sm leading-relaxed max-w-xs drop-shadow-sm font-medium">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Yellow Button below card */}
              <div className="flex justify-center pt-8 pb-4 bg-white z-0">
                <Link
                  href={card.link}
                  className="px-10 py-3.5 bg-yellow-400 text-black text-sm font-bold tracking-widest rounded-full shadow-md hover:bg-yellow-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative"
                >
                  XEM NGAY
                  <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
