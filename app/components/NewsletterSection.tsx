import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function NewsletterSection() {
  const collections = await (prisma as any).collection.findMany({
    take: 4,
  });

  return (
    <section id="contact" style={{ scrollMarginTop: '160px' }} className="relative w-full bg-gradient-to-b from-teal-50 to-white">
      {/* Top Part: Background + Centered Form */}
      <div className="relative w-full h-[450px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bgmo.png"
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        {/* Floating Contact Form Card */}
        <div className="relative z-10 bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 md:p-10 max-w-[550px] w-[90%] mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 tracking-wide uppercase">
            LIÊN HỆ VỚI KILALA EYE
          </h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed px-4">
            Bạn có thắc mắc về sản phẩm hoặc cần tư vấn về độ cận? Hãy để lại thông tin, đội ngũ chuyên gia của chúng tôi sẽ liên hệ hỗ trợ bạn ngay lập tức!
          </p>

          <form className="space-y-4 px-2 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full px-5 py-3 bg-gray-100 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="w-full px-5 py-3 bg-gray-100 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
              />
            </div>
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full px-5 py-3 bg-gray-100 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
            />
            <textarea
              placeholder="Lời nhắn của bạn (Ví dụ: Tư vấn độ cận -2.00, tư vấn mẫu lens tự nhiên...)"
              rows={3}
              className="w-full px-5 py-3 bg-gray-100 border-none rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow resize-none"
            ></textarea>
            <button
              type="button"
              className="w-full py-3 mt-2 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-sm rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Gửi tin nhắn ngay
            </button>
          </form>
        </div>
      </div>

      {/* Middle Part: Teal Social Bar */}
      <div className="w-full bg-teal-600 pt-6 pb-20 relative z-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center md:justify-end gap-5">
          <span className="text-white font-bold text-[15px]">
            Follow chúng mình để cập nhật lens mới nhất nha
          </span>
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="#" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.7-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            {/* Tiktok */}
            <a href="#" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
            </a>
            {/* Zalo */}
            <a href="#" className="w-8 h-8 rounded-full bg-[#0068FF] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Part: Brands Section */}
      <div className="max-w-6xl mx-auto px-4 relative z-10 -mt-10 mb-16">
        <div className="bg-white rounded-lg shadow-[0_4px_20px_rgb(0,0,0,0.08)] p-6 md:p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-none mb-2 tracking-tight uppercase">CÁC BỘ SƯU TẬP</h3>
            <p className="text-[13px] text-gray-500">Thiết kế độc đáo, an toàn và đa dạng màu sắc</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {collections.map((col: any, index: number) => {
              // Dùng ảnh mock nếu không có hoặc lấy theo db
              const colImage = col.image || `/images/${index % 4 + 1}.jpg`;
              
              return (
              <Link key={col.id} href={`/collections/${col.slug}`} className="flex flex-col items-center group">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-50 border border-gray-200 group-hover:border-teal-300 transition-colors shadow-sm focus:outline-none">
                  <Image
                    src={colImage}
                    alt={col.name}
                    fill
                    className="object-cover p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="mt-3 text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors text-center line-clamp-1 truncate w-full px-2 object-contain">
                  {col.name}
                </span>
              </Link>
            )})}
          </div>
        </div>
      </div>
    </section>
  );
}
