'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const blogPosts = [
  {
    id: 1,
    title: 'Hướng dẫn cách làm giảm và hạn chế độ cận thị tại nhà đúng cách',
    date: 'Thứ 3, 01/03/2022',
    image: '/images/1.jpg',
    link: '/blog/huong-dan-giam-can-thi',
  },
  {
    id: 2,
    title: 'CHÍNH SÁCH BẢO MẬT',
    date: 'Thứ 4, 19/10/2022',
    image: '/images/2.jpg',
    link: '/blog/chinh-sach-bao-mat',
  },
  {
    id: 3,
    title: 'Điều khoản và điều kiện giao dịch, mua bán hàng hóa',
    date: 'Thứ 6, 28/10/2022',
    image: null,
    link: '/blog/dieu-khoan-giao-dich',
  },
  {
    id: 4,
    title: 'CHÍNH SÁCH BẢO HÀNH ĐẶC BIỆT TẠI KÍNH MẮT LILY – KIM CHỈ NAM 100% HÀI LÒNG CHO KHÁCH HÀNG',
    date: 'Thứ 4, 05/04/2023',
    image: '/images/3.jfif',
    link: '/blog/chinh-sach-bao-hanh',
  },
  {
    id: 5,
    title: 'Bí quyết chọn kính râm phù hợp với khuôn mặt',
    date: 'Thứ 2, 10/05/2023',
    image: '/images/4.jpg',
    link: '/blog/chon-kinh-ram-phu-hop',
  },
];

export default function BlogSection() {
  return (
    <section className="py-12 px-4 md:px-8 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title with Line */}
        <div className="flex items-center mb-8">
          <h2 className="text-[22px] font-normal text-gray-800 uppercase whitespace-nowrap pr-4 tracking-wide">
            GÓC LILY
          </h2>
          <div className="flex-grow h-[1px] bg-gray-300"></div>
        </div>

        {/* Blog Swiper Carousel */}
        <div className="relative px-2">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="blog-swiper pb-4"
          >
            {blogPosts.map((post) => (
              <SwiperSlide key={post.id} className="h-auto">
                <Link href={post.link} className="block h-full cursor-pointer group">
                  <div className="bg-white h-full flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                    {/* Render specific layout for items without images */}
                    {post.image ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-[12px]"></div> /* Placeholder spacing if no image */
                    )}
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-[15px] font-bold text-gray-800 leading-snug mb-3 line-clamp-3 group-hover:text-yellow-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[13px] text-gray-400 mt-auto">
                        {post.date}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom style for default Swiper arrows to make them thinner, blue and closer to the design if needed. But default next/image handles styling cleanly. */}
          <style dangerouslySetInnerHTML={{__html: `
            .blog-swiper .swiper-button-next,
            .blog-swiper .swiper-button-prev {
              color: #007bff; /* Blue arrows matching reference */
              transform: scale(0.6);
              margin-top: -20px;
            }
            .blog-swiper .swiper-button-next { right: -10px; }
            .blog-swiper .swiper-button-prev { left: -10px; }
          `}} />
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center flex justify-center">
          <Link
            href="/blog"
            className="inline-block px-10 py-2 border border-gray-300 text-sm text-gray-700 hover:border-black hover:text-white hover:bg-black transition-all duration-300"
          >
            Xem tất cả »
          </Link>
        </div>

      </div>
    </section>
  );
}
