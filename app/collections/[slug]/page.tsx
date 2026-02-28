import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import ClientFilters from "@/app/products/ClientFilters";
import Pagination from "@/app/products/Pagination";
import SortSelector from "@/app/products/SortSelector";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

// In Next.js 15+, searchParams is passed as a Promise.
type SearchParamsPromise = Promise<{ [key: string]: string | string[] | undefined }>;
type ParamsPromise = Promise<{ slug: string }>;

export default async function CollectionPage(props: { params: ParamsPromise, searchParams: SearchParamsPromise }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const slug = params.slug;
  
  // Lấy thông tin bộ sưu tập
  const collection = await prisma.collection.findUnique({
    where: { slug }
  });

  if (!collection) {
    notFound();
  }

  // Khởi tạo các filter
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const categorySlug = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  
  const minPriceRaw = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined;
  const maxPriceRaw = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined;
  const minPrice = (minPriceRaw && minPriceRaw !== "") ? parseInt(minPriceRaw, 10) : undefined;
  const maxPrice = (maxPriceRaw && maxPriceRaw !== "") ? parseInt(maxPriceRaw, 10) : undefined;
  
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
  
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = parseInt(pageStr, 10) || 1;
  const take = 12; // 12 items per page
  const skip = (page - 1) * take;

  const whereCondition: Prisma.ProductWhereInput = {
    collectionId: collection.id
  };
  
  if (q && q.trim() !== "") {
    whereCondition.name = { contains: q.trim() };
  }
  
  if (categorySlug && categorySlug !== "") {
    whereCondition.category = { slug: categorySlug };
  }

  // Lọc giá
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereCondition.price = {
      ...(minPrice !== undefined && { gte: minPrice }),
      ...(maxPrice !== undefined && { lte: maxPrice }),
    };
  }

  // Logic Sắp xếp
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'name_asc') orderBy = { name: 'asc' };

  // Optimize data fetching
  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereCondition,
      take,
      skip,
      include: {
        images: {
          take: 2,
        },
        collection: true,
        reviews: {
          select: {
            rating: true
          }
        }
      } as any,
      orderBy
    }),
    prisma.product.count({ where: whereCondition }),
    prisma.category.findMany()
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col pt-[64px]">
      
      {/* Background Banner Top */}
      <div className="bg-gray-900 w-full h-48 lg:h-72 mt-[64px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {collection.image ? (
          <Image src={collection.image} alt={collection.name} fill className="object-cover opacity-60 z-0" />
        ) : (
          <Image src="/images/bgmo.png" alt="Kilala Banner" fill className="object-cover opacity-40 z-0" />
        )}
        <div className="z-20 text-center px-4 max-w-3xl">
          <span className="text-teal-400 font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Bộ Sưu Tập</span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg mb-4">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="mt-4 text-gray-200 text-sm md:text-base font-medium opacity-90 drop-shadow max-w-2xl mx-auto leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      <main className="flex-1 py-12 px-4 md:px-8 max-w-[1400px] w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative w-full items-start">
          {/* Left Side: Sidebar Filters */}
          <aside className="w-full lg:w-[300px] flex-shrink-0 z-10 sticky top-[100px]">
            <ClientFilters categories={categories} />
          </aside>

          {/* Right Side: Products Grid */}
          <section className="flex-1 w-full min-w-0">
            {/* Toolbar Top */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-5 rounded-xl shadow-sm border border-teal-50">
              <p className="text-gray-600 font-medium text-sm">
                Tìm thấy <span className="text-teal-600 font-black">{totalCount}</span> sản phẩm 
                {q && <span> cho từ khóa "<span className="text-teal-600 font-black">{q}</span>"</span>}
                {categorySlug && <span> trong danh mục "<span className="text-teal-600 font-black">{categorySlug}</span>"</span>}
              </p>
              
              <div className="mt-4 sm:mt-0">
                 <SortSelector />
              </div>
            </div>

            {/* Empty State */}
            {products.length === 0 ? (
              <div className="bg-white p-16 rounded-xl border border-gray-100 text-center shadow-sm">
                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl opacity-80">🔍</span>
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-3 tracking-tight uppercase">Không tìm thấy sản phẩm!</h3>
                <p className="text-gray-500 text-sm font-medium">Vui lòng thử thay đổi bộ lọc hoặc phạm vi giá.</p>
                <Link href={`/collections/${slug}`} className="mt-6 inline-block px-6 py-2 bg-teal-600 text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-teal-700 transition">
                   Xóa bộ lọc
                </Link>
              </div>
            ) : (
              // Products List
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product: any) => {
                    const imageUrl = product.images?.[0]?.url || '/images/default-product.jpg';
                    const hoverImageUrl = product.images?.[1]?.url || imageUrl;
                    const brandName = product.collection?.name || 'Kilala';

                    // Tính điểm đánh giá trung bình
                    const totalReviews = product.reviews ? product.reviews.length : 0;
                    const avgRating = totalReviews > 0 
                      ? product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews
                      : 0;

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="group block"
                      >
                        <div className="relative bg-white rounded-xl overflow-hidden transition-all duration-300 border border-gray-100 shadow-sm hover:border-teal-200 hover:shadow-xl h-full flex flex-col">
                          
                          {/* Image Box */}
                          <div className="relative aspect-square overflow-hidden bg-gray-50/80">
                            {/* Base Image */}
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover transition-all duration-[600ms] ease-out group-hover:scale-110 group-hover:opacity-0"
                            />
                            {/* Hover Image */}
                            <Image
                              src={hoverImageUrl}
                              alt={`${product.name} Hover`}
                              fill
                              className="object-cover transition-all duration-[600ms] ease-out absolute inset-0 opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105"
                            />

                            {/* Stock Badge */}
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-20">
                                <span className="bg-gray-900 text-white px-5 py-2 text-xs font-black uppercase tracking-widest rounded-full shadow-lg">Hết hàng</span>
                              </div>
                            )}

                            {/* Tags Collection */}
                            <div className="absolute top-3 left-3 z-10">
                              <span className="px-3 py-1.5 bg-teal-600 text-white text-[10px] font-black tracking-widest uppercase rounded-md shadow-sm">
                                {brandName}
                              </span>
                            </div>
                          </div>

                          {/* Detail Box */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div className="flex items-center gap-1.5 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                   <Star 
                                      key={i} 
                                      size={12} 
                                      className={i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"} 
                                   />
                                ))}
                              </div>
                              {totalReviews > 0 && (
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">({totalReviews})</span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 mb-3 line-clamp-2 min-h-[40px] leading-relaxed group-hover:text-teal-600 transition-colors uppercase tracking-tight">
                              {product.name}
                            </h3>
                            <div className="flex items-end justify-between mt-auto">
                              <div className="flex flex-col">
                                {product.originalPrice && (
                                  <span className="text-[11px] sm:text-[12px] text-gray-400 line-through font-medium mb-0.5">
                                    {product.originalPrice.toLocaleString('vi-VN')} ₫
                                  </span>
                                )}
                                <p className="text-teal-600 font-black text-lg tracking-tight">
                                  {product.price.toLocaleString('vi-VN')} ₫
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-12">
                   <Pagination totalPages={totalPages} currentPage={page} />
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
