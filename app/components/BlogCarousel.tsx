'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

interface Post {
  id: number;
  title: string;
  date: string;
  image: string;
  link: string;
}

export default function BlogCarousel({ posts }: { posts: Post[] }) {
  return (
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
        {posts.map((post) => (
          <SwiperSlide key={post.id} className="h-auto">
            <Link href={post.link} className="block h-full cursor-pointer group">
              <div className="bg-white h-full flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 rounded-md overflow-hidden">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-[15px] font-bold text-gray-800 leading-snug mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[12px] text-gray-400 mt-auto font-medium">
                    {post.date}
                  </p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* View All Button */}
      <div className="mt-8 text-center flex justify-center">
        <Link
          href="/blog"
          className="inline-block px-10 py-2.5 border border-gray-300 text-sm font-bold uppercase tracking-widest text-gray-700 hover:border-teal-600 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300 rounded-md shadow-sm"
        >
          Xem tất cả bài viết »
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .blog-swiper .swiper-button-next,
        .blog-swiper .swiper-button-prev {
          color: #0d9488;
          transform: scale(0.6);
          margin-top: -20px;
          background: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .blog-swiper .swiper-button-next { right: -15px; }
        .blog-swiper .swiper-button-prev { left: -15px; }
        .blog-swiper .swiper-button-next:after,
        .blog-swiper .swiper-button-prev:after {
          font-size: 24px;
          font-weight: bold;
        }
      `}} />
    </div>
  );
}
