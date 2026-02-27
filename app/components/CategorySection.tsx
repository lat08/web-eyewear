import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function CategorySection() {
  const categories = await (prisma as any).category.findMany({
    take: 4,
  });

  return (
    <section className="py-24 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            DANH MỤC SẢN PHẨM
          </h2>
          <div className="w-24 h-1.5 bg-teal-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Lựa chọn thời gian sử dụng phù hợp với nhu cầu và phong cách sống của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category: any, index: number) => {
            const catImage = category.image || `/images/categories/${category.slug}.jpg`;
            return (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}`} 
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
              >
                <Image
                  src={catImage}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-white text-2xl font-black tracking-tight uppercase mb-4 group-hover:text-teal-400 transition-colors">
                    {category.name}
                  </h3>
                  <div className="w-12 h-1 bg-teal-500 rounded-full transform origin-left transition-all duration-500 group-hover:w-full group-hover:bg-teal-400" />
                  
                  <div className="mt-4 flex items-center gap-2 text-white/0 group-hover:text-white/100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Khám phá ngay</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
