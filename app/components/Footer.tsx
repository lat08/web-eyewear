'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#fafafa] pt-12 pb-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-10">

          {/* Column 1: Company Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-teal-700 font-bold text-base uppercase">Kilala Eye</h3>

            <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
              <p>
                <strong className="text-gray-900">Địa chỉ:</strong> NO13-LK13-34 Khu Dọc Bún 1 -
                Khu đô thị Văn Khê - Phường Hà Đông - Hà Nội
              </p>

              <p>
                <strong className="text-gray-900">Mon - Sun:</strong> 8:30 - 22:00
              </p>

              <p>
                <strong className="text-gray-900">Email:</strong> <a href="mailto:cskh@kilalaeye.com" className="hover:text-teal-600 transition-colors">cskh@kilalaeye.com</a>
              </p>

              <p>
                <strong className="text-gray-900">Hotline:</strong> <a href="tel:1900638096" className="text-teal-700 font-semibold hover:text-teal-600 transition-colors">1900 638 096</a>
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

          {/* Column 2: Products */}
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-4 uppercase tracking-widest">Sản phẩm</h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li><Link href="/products?category=lens-1-ngay" className="hover:text-teal-600 transition-colors block">Lens 1 Ngày</Link></li>
                <li><Link href="/products?category=lens-1-thang" className="hover:text-teal-600 transition-colors block">Lens 1 Tháng</Link></li>
                <li><Link href="/products?category=lens-6-thang" className="hover:text-teal-600 transition-colors block">Lens 6 Tháng</Link></li>
                <li><Link href="/products?category=phu-kien" className="hover:text-teal-600 transition-colors block">Phụ kiện</Link></li>
                <li><Link href="/products" className="hover:text-teal-600 transition-colors block font-semibold text-teal-700">Xem tất cả sản phẩm →</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Policies & Support */}
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-4 uppercase tracking-widest">Hỗ trợ khách hàng</h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li><Link href="/warranty" className="hover:text-teal-600 transition-colors block">Chính sách bảo hành</Link></li>
                <li><Link href="/warranty" className="hover:text-teal-600 transition-colors block">Chính sách đổi trả</Link></li>
                <li><Link href="/#contact" className="hover:text-teal-600 transition-colors block">Giao hàng & Thanh toán</Link></li>
                <li><Link href="/#contact" className="hover:text-teal-600 transition-colors block">Liên hệ / Tư vấn</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Account & Shopping */}
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-4 uppercase tracking-widest">Tài khoản của tôi</h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li><Link href="/profile" className="hover:text-teal-600 transition-colors block">Thông tin tài khoản</Link></li>
                <li><Link href="/profile" className="hover:text-teal-600 transition-colors block">Lịch sử đơn hàng</Link></li>
                <li><Link href="/profile" className="hover:text-teal-600 transition-colors block">Theo dõi tiến độ giao hàng</Link></li>
                <li><Link href="/cart" className="hover:text-teal-600 transition-colors block">Giỏ hàng của bạn</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-gray-200 text-center text-sm text-gray-500 font-medium">
          Đại diện pháp luật: Nguyễn Tiến Dũng. Ngày cấp giấy phép: 14/08/2019. Ngày hoạt động: 14/08/2019
        </div>
      </div>
    </footer>
  );
}
