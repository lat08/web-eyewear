"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    id: 1,
    image: "/images/anh1.webp",
    title: "Kính Áp Tròng Cao Cấp",
    subtitle: "Trải Nghiệm Đỉnh Cao",
    description: "Phong cách tự nhiên, chất liệu ẩm mượt, êm ái bảo vệ đôi mắt suốt ngày dài.",
    buttonText: "Khám Phá Ngay",
    buttonLink: "/products",
    background: "from-teal-50 to-cyan-50",
  },
  {
    id: 2,
    image: "/images/anh2.webp",
    title: "Lens Màu Thời Trang",
    subtitle: "Tỏa Sáng Mọi Góc Nhìn",
    description: "Đa dạng màu sắc, thiết kế độc quyền giúp đôi mắt to tròn, lấp lánh và đầy cuốn hút.",
    buttonText: "Xem Chi Tiết",
    buttonLink: "/products",
    background: "from-blue-50 to-indigo-50",
  },
];

export default function Hero() {
  return (
    <section className="pt-16 relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="w-full h-[600px] lg:h-[700px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link href={slide.buttonLink} className="block relative w-full h-full focus:outline-none">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
            </Link>
          </SwiperSlide>
        ))}



        {/* Custom Pagination */}
        <div className="swiper-pagination absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2"></div>
      </Swiper>
    </section>
  );
}
