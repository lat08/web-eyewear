'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#fafafa] pt-12 pb-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-10">
          
          {/* Column 1: Company Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-gray-900 font-bold text-base uppercase">CÔNG TY CỔ PHẦN ULTD THỊNH PHÁT</h3>
            
            <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
              <p>
                <strong className="text-gray-900">Địa chỉ:</strong> NO13-LK13-34 Khu Dọc Bún 1 - 
                Khu đô thị Văn Khê - Phường Hà Đông - Hà Nội
              </p>
              
              <p>
                <strong className="text-gray-900">Mon - Sun:</strong> 8:30 - 22:00
              </p>
              
              <p>
                <strong className="text-gray-900">Email:</strong> <a href="mailto:cskh@kinhmatlily.com" className="hover:text-[#fcc200] transition-colors">cskh@kinhmatlily.com</a>
              </p>
              
              <p>
                <strong className="text-gray-900">Hotline:</strong> <a href="tel:1900638096" className="text-black font-semibold hover:text-[#fcc200] transition-colors">1900 638 096</a>
              </p>
            </div>

            {/* BCT Logo */}
            <div className="pt-2">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="/images/dangkybct.png" 
                  alt="Đã thông báo Bộ Công Thương" 
                  width={150} 
                  height={57}
                  className="w-[150px] object-contain"
                />
              </a>
            </div>
          </div>

          {/* Column 2: Maps */}
          <div className="flex flex-col md:col-span-1 relative h-[250px] w-full rounded-md overflow-hidden bg-gray-200">
            {/* Embedded Google Maps (iframe) */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0858547285517!2d105.7895!3d21.0292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4b9bbd0a2f%3A0x6d97c6c4125f4a7c!2sLily%20Eyewear!5e0!3m2!1sen!2svn!4v1700000000000!5m2!1sen!2svn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 z-0 grayscale opacity-80"
            ></iframe>
            
            {/* Red Button Overlay centered inside maps wrapper */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <Link href="/stores" className="pointer-events-auto bg-[#e43a45] hover:bg-red-700 text-white font-semibold text-[13px] px-6 py-2.5 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
                Tìm cửa hàng →
              </Link>
            </div>
          </div>

          {/* Column 3: Policies & News */}
          <div className="flex flex-col space-y-8">
            {/* Section: Các chính sách */}
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-4">Các chính sách</h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li><Link href="/policy/kham-mat" className="hover:text-[#fcc200] transition-colors block">Khám mắt miễn phí</Link></li>
                <li><Link href="/policy/bao-hanh" className="hover:text-[#fcc200] transition-colors block">Bảo hành</Link></li>
                <li><Link href="/policy/doi-tra" className="hover:text-[#fcc200] transition-colors block">Đổi trả</Link></li>
                <li><Link href="/policy/van-chuyen" className="hover:text-[#fcc200] transition-colors block">Vận chuyển</Link></li>
                <li><Link href="/policy/thu-cu" className="hover:text-[#fcc200] transition-colors block">Thu cũ - Đổi mới</Link></li>
                <li><Link href="/policy/bao-mat" className="hover:text-[#fcc200] transition-colors block">Chính sách bảo mật</Link></li>
              </ul>
            </div>

            {/* Section: Tin tức */}
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-4">Tin tức</h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li><Link href="/news/bao-ve-mat" className="hover:text-[#fcc200] transition-colors block">Bảo vệ mắt</Link></li>
                <li><Link href="/news/kien-thuc" className="hover:text-[#fcc200] transition-colors block">Kiến thức</Link></li>
                <li><Link href="/news/suc-khoe" className="hover:text-[#fcc200] transition-colors block">Sức khỏe</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Products & Partner */}
          <div className="flex flex-col space-y-8">
            {/* Section: Sản phẩm */}
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-4">Sản phẩm</h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li><Link href="/products/gong-can" className="hover:text-[#fcc200] transition-colors block">Gọng kính cận</Link></li>
                <li><Link href="/products/gong-ram" className="hover:text-[#fcc200] transition-colors block">Gọng kính râm</Link></li>
                <li><Link href="/products/trong-kinh" className="hover:text-[#fcc200] transition-colors block">Tròng kính</Link></li>
                <li><Link href="/products/phu-kien" className="hover:text-[#fcc200] transition-colors block">Phụ kiện</Link></li>
              </ul>
            </div>

            {/* Section: Website thành viên */}
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-3">Website thành viên</h3>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                Hệ thống kính mắt thiết kế cao cấp dành cho nam giới
              </p>
              <Link href="https://farello.vn" target="_blank" rel="noopener noreferrer" className="text-[15px] text-[#4db2b6] hover:text-teal-700 transition-colors font-medium">
                Kính mắt Farello
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Bottom / Copyright area */}
        <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-500 font-medium">
          Đại diện pháp luật: Nguyễn Tiến Dũng. Ngày cấp giấy phép: 14/08/2019. Ngày hoạt động: 14/08/2019
        </div>
      </div>
    </footer>
  );
}
