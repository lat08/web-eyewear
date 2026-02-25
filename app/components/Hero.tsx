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
    image: "https://cdn.kinhmatlily.com/lily01/2022/3/z3210171305314_071225dc9171bf082e53f59cef63dda5%20(1)-1647397061000.jpeg",
    title: "Bộ Sưu Tập Mới 2024",
    subtitle: "Kính Râm Premium",
    description: "Những thiết kế độc đáo, chất lượng vượt trội",
    buttonText: "Mua Ngay",
    buttonLink: "/products?category=sunglasses",
    background: "from-amber-50 to-rose-50",
  },
  {
    id: 2,
    image: "https://cdn.kinhmatlily.com/lily01/2026/1/[Lily]%20Cover%20web%20(1920%20x%20460%20px)%20(2)-1769855604000.jpeg",
    title: "Giảm Giá Đến 50%",
    subtitle: "Kính Cận Cao Cấp",
    description: "Mua kính mắt chính hãng với giá ưu đãi",
    buttonText: "Xem Kho Hàng",
    buttonLink: "/products?category=eyewear",
    background: "from-blue-50 to-cyan-50",
  },
  {
    id: 3,
    image: "https://www.gentlemansgazette.com/wp-content/uploads/2016/08/Classic-RayBan-Aviator-Sunglasses-1500x878.jpg",
    title: "Kính Mắt Thời Trang",
    subtitle: "Đầu Tư Phong Cách",
    description: "Những mẫu kính hot trend được yêu thích nhất",
    buttonText: "Khám Phá",
    buttonLink: "/products?category=fashion",
    background: "from-purple-50 to-pink-50",
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
            <div className={`relative w-full h-full bg-gradient-to-br ${slide.background}`}>
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover opacity-60"
                  priority
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

              {/* Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="max-w-2xl">
                  <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-4 animate-fadeIn">
                    {slide.subtitle}
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
                    {slide.title}
                  </h1>
                  <p className="text-lg lg:text-xl text-white/90 mb-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                    {slide.description}
                  </p>
                  <Link
                    href={slide.buttonLink}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700 transition-all duration-300 hover:scale-105 animate-fadeIn"
                    style={{ animationDelay: "0.3s" }}
                  >
                    {slide.buttonText}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20">
          <button className="swiper-button-prev bg-white/20 backdrop-blur-sm text-white w-12 h-12 rounded-full hover:bg-white/30 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="swiper-button-next bg-white/20 backdrop-blur-sm text-white w-12 h-12 rounded-full hover:bg-white/30 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Custom Pagination */}
        <div className="swiper-pagination absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2"></div>
      </Swiper>
    </section>
  );
}
