'use client';

import Image from 'next/image';
import Link from 'next/link';

const serviceCards = [
  {
    id: 1,
    image: '/images/1.jpg',
    preTitle: 'CẨM NANG',
    title: 'HƯỚNG DẪN ĐEO LENS',
    description: 'Các bước đeo và bảo quản lens đúng chuẩn chuyên gia cho người mới',
    link: '/blog/huong-dan-deo-lens-cho-nguoi-moi',
  },
  {
    id: 2,
    image: '/images/2.jpg',
    preTitle: 'HỖ TRỢ',
    title: 'LIÊN HỆ TƯ VẤN',
    description: 'Đội ngũ Kilala luôn sẵn sàng tư vấn độ cận và mẫu lens phù hợp nhất cho bạn',
    link: '#contact',
  },
  {
    id: 3,
    image: '/images/4.jpg',
    preTitle: 'THÔNG MINH',
    title: 'TÌM LENS THEO MÀU',
    description: 'Dễ dàng lọc các mẫu lens theo màu sắc và phong cách bạn yêu thích',
    link: '/products',
  },
];

export default function SuperComboSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* LENS COMBO Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b-2 border-gray-900">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase italic">
              LENS COMBO
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium italic">
              <strong className="text-teal-600">LENS COMBO</strong> là sự kết hợp hoàn hảo giữa các dòng lens bán chạy nhất và dung dịch chăm sóc chuyên dụng, giúp bạn tiết kiệm chi phí tối đa mà vẫn đảm bảo an toàn cho đôi mắt.
            </p>
          </div>
          <div className="text-left md:text-right">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 text-sm font-black text-gray-900 hover:text-teal-600 transition-all uppercase tracking-[0.2em]"
            >
              <span>KHÁM PHÁ NGAY</span>
              <div className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {serviceCards.map((card) => (
            <div key={card.id} className="flex flex-col group">
              {/* Image Card with Overlay */}
              <div className="relative overflow-hidden rounded-md shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Modern Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Text Content over image */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-8 text-center z-10">
                  {card.preTitle && (
                    <p className="text-teal-400 text-[10px] font-black tracking-[0.3em] mb-3 uppercase">
                      {card.preTitle}
                    </p>
                  )}
                  <h3 className="text-white text-2xl md:text-3xl font-black mb-4 leading-tight uppercase tracking-tight">
                    {card.title}
                  </h3>
                  <div className="h-1 w-12 bg-teal-500 mb-4 rounded-full transform origin-center transition-transform duration-500 group-hover:scale-x-150"></div>
                  <p className="text-gray-200 text-sm leading-relaxed font-medium italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Minimalist Link below card */}
              <div className="flex justify-center pt-8">
                <Link
                  href={card.link}
                  className="relative px-8 py-3 group-hover:bg-teal-600 text-gray-900 group-hover:text-white border-2 border-gray-900 group-hover:border-teal-600 text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 rounded-md"
                >
                  XEM CHI TIẾT
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
