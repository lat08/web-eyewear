import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import ClientFilters from "./ClientFilters";
import Pagination from "./Pagination";
import SortSelector from "./SortSelector";
import { Prisma } from "@prisma/client";

// In Next.js 15+, searchParams is passed as a Promise.
type SearchParamsPromise = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ProductsPage(props: { searchParams: SearchParamsPromise }) {
  // Await the entire searchParams object first
  const searchParams = await props.searchParams;
  
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const categorySlug = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  
  // Sửa lỗi parsing giá để tránh NaN
  const minPriceRaw = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined;
  const maxPriceRaw = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined;
  const minPrice = (minPriceRaw && minPriceRaw !== "") ? parseInt(minPriceRaw, 10) : undefined;
  const maxPrice = (maxPriceRaw && maxPriceRaw !== "") ? parseInt(maxPriceRaw, 10) : undefined;
  
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
  
  const pageStr = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const page = parseInt(pageStr, 10) || 1;
  const take = 12; // 12 items per page
  const skip = (page - 1) * take;

  const whereCondition: Prisma.ProductWhereInput = {};
  
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
      <div className="bg-teal-700 w-full h-48 lg:h-64 mt-[64px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <Image src="/images/bgmo.png" alt="Kilala Banner" fill className="object-cover opacity-50 z-0" />
        <div className="z-20 text-center px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
            Sản Phẩm Kilala
          </h1>
          <p className="mt-3 text-teal-50 text-base md:text-lg font-medium opacity-90 drop-shadow">
            Khám phá vẻ đẹp tiềm ẩn của đôi mắt bạn
          </p>
        </div>
      </div>

      <main className="flex-1 py-12 px-4 md:px-8 max-w-[1400px] w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative w-full items-start">
          {/* Left Side: Sidebar Filters */}
          <aside className="w-full lg:w-[300px] flex-shrink-0 z-10">
            <ClientFilters categories={categories} />
          </aside>

          {/* Right Side: Products Grid */}
          <section className="flex-1 w-full min-w-0">
            {/* Toolbar Top */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-4 rounded-md shadow-sm border border-gray-100">
              <p className="text-gray-600 font-medium text-sm">
                Tìm thấy <span className="text-teal-600 font-bold">{totalCount}</span> sản phẩm 
                {q && <span> cho từ khóa "<span className="text-teal-600 font-bold">{q}</span>"</span>}
                {categorySlug && <span> trong danh mục "<span className="text-teal-600 font-bold">{categorySlug}</span>"</span>}
              </p>
              
              <SortSelector />
            </div>

            {/* Empty State */}
            {products.length === 0 ? (
              <div className="bg-white p-16 rounded-md border border-gray-100 text-center shadow-sm">
                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Không tìm thấy sản phẩm!</h3>
                <p className="text-gray-500 text-lg">Vui lòng thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              </div>
            ) : (
              // Products List
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product: any) => {
                    // Safe logic cho 2 ảnh hover
                    const imageUrl = product.images?.[0]?.url || '/images/default-product.jpg';
                    const hoverImageUrl = product.images?.[1]?.url || imageUrl;
                    const brandName = product.collection?.name || 'Kilala';

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="group block"
                      >
                        <div className="relative bg-white rounded-md overflow-hidden transition-all duration-300 border border-transparent shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:border-teal-100 hover:shadow-[0_12px_30px_rgb(20,184,166,0.12)] h-full flex flex-col">
                          
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
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <h3 className="text-[14px] sm:text-[15px] font-bold text-gray-800 mb-3 line-clamp-2 min-h-[42px] leading-relaxed group-hover:text-teal-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-end justify-between mt-auto">
                              <p className="text-teal-600 font-extrabold text-lg tracking-tight">
                                {product.price.toLocaleString('vi-VN')} ₫
                              </p>
                              {product.originalPrice && (
                                <span className="text-[11px] sm:text-[13px] text-gray-400 line-through font-medium">
                                  {product.originalPrice.toLocaleString('vi-VN')} ₫
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                <Pagination totalPages={totalPages} currentPage={page} />
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
