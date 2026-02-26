'use client';

import Image from 'next/image';

export default function NewsletterSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Top Part: Background Image + Centered Form */}
      <div className="relative w-full h-[500px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bgmo.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Floating Form Card */}
        <div className="relative z-10 bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 md:p-10 max-w-[550px] w-[90%] mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 tracking-wide">
            ĐĂNG KÝ NGAY, NHẬN CHIẾT KHẤU 50.000Đ
          </h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed px-4">
            Đăng ký ngay bằng địa chỉ email để nhận thông tin ưu đãi lớn nhất từ Lily, đồng thời 
            nhận ngay một voucher chiết khấu trực tiếp 50.000Đ vào hoá đơn tiếp theo!
          </p>

          <form className="space-y-4 px-2 md:px-6">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full px-5 py-3 bg-gray-100 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-5 py-3 bg-gray-100 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              className="w-full px-5 py-3 bg-gray-100 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
            />
            <button
              type="button"
              className="w-full py-3 mt-2 bg-[#fbb040] hover:bg-yellow-500 text-white font-bold text-sm rounded-full transition-colors shadow-md hover:shadow-lg"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* Middle Part: Yellow Social Bar */}
      <div className="w-full bg-[#fbb040] pt-6 pb-20 relative z-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center md:justify-end gap-5">
          <span className="text-gray-900 font-bold text-[15px]">
            Follow chúng mình để cập nhật mẫu kính mới nhất nha
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
            {/* Shopee */}
            <a href="#" className="w-8 h-8 rounded-full bg-[#f53d2d] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm flex-col">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 7.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M5.5 8.5C5.5 7.9477 5.94772 7.5 6.5 7.5H17.5C18.0523 7.5 18.5 7.9477 18.5 8.5V18.5C18.5 19.6046 17.6046 20.5 16.5 20.5H7.5C6.39543 20.5 5.5 19.6046 5.5 18.5V8.5Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Part: White Newsletter Bar Overlapping Yellow Bar */}
      <div className="max-w-6xl mx-auto px-4 relative z-10 -mt-10 mb-16">
        <div className="bg-white rounded-lg shadow-[0_4px_20px_rgb(0,0,0,0.08)] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div className="flex flex-col whitespace-nowrap">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-none mb-1 tracking-tight">ĐĂNG KÝ EMAIL</h3>
            <p className="text-[13px] text-gray-500">Để nhận những ưu đãi hấp dẫn từ Lily</p>
          </div>
          
          <div className="flex-1 w-full max-w-3xl">
            <form className="flex w-full bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm transition-shadow focus-within:ring-1 focus-within:ring-gray-300">
              <select className="px-3 md:px-5 py-3 bg-gray-50 border-r border-gray-200 text-[13px] text-gray-600 focus:outline-none min-w-[100px] cursor-pointer">
                <option>Giới tính</option>
                <option>Nam</option>
                <option>Nữ</option>
              </select>
              <input
                type="text"
                placeholder="Họ và tên"
                className="flex-1 px-3 md:px-5 py-3 border-r border-gray-200 text-[13px] text-gray-800 focus:outline-none placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="flex-[1.5] px-3 md:px-5 py-3 text-[13px] text-gray-800 focus:outline-none placeholder-gray-400"
              />
              <button
                type="button"
                className="bg-[#333333] hover:bg-black text-white px-5 md:px-8 py-3 transition-colors flex flex-col items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
