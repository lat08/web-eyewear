import Image from 'next/image';
import Link from 'next/link';
import prisma from "@/lib/prisma";

export default async function FeaturedProducts() {
  const prismaAny = prisma as any;
  const products = await prismaAny.product.findMany({
    where: { isFeatured: true },
    take: 4,
    include: {
      images: {
        take: 2
      },
      collection: true,
      reviews: {
        select: {
          rating: true
        }
      }
    }
  });

  const categories = await prismaAny.category.findMany({
    take: 4,
  });

  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            SẢN PHẨM NỔI BẬT
          </h2>
          <div className="w-24 h-1.5 bg-teal-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Khám phá những mẫu lens được yêu thích nhất với công nghệ cấp ẩm vượt trội từ Hàn Quốc & Nhật Bản.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.map((product: any) => {
            const imageUrl = product.images?.[0]?.url || '/images/default-product.jpg';
            const hoverImageUrl = product.images?.[1]?.url || imageUrl;
            const brandName = product.collection?.name || 'Kilala';

            return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="relative bg-white rounded-xl overflow-hidden transition-all duration-500 border border-gray-100 hover:border-teal-200 hover:shadow-2xl">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0"
                  />
                  <Image
                    src={hoverImageUrl}
                    alt={`${product.name} Hover`}
                    fill
                    className="object-cover transition-all duration-700 absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-teal-800 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border border-teal-100">
                      {brandName}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => {
                        const totalReviews = product.reviews.length;
                        const avgRating = totalReviews > 0 
                          ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews
                          : 0;
                        return (
                          <svg key={i} className={`w-3 h-3 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        );
                      })}
                    </div>
                    {product.reviews.length > 0 && (
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">({product.reviews.length})</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 min-h-[40px] group-hover:text-teal-600 transition-colors uppercase tracking-tight">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-teal-600 font-black text-lg">
                      {product.price.toLocaleString('vi-VN')} ₫
                    </p>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-teal-600 group-hover:text-white transition-all transform group-hover:rotate-90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )})}
        </div>

        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-teal-600 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <span>Xem tất cả sản phẩm</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
