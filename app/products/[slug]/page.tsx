import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/Breadcrumb";
import ProductGallery from "./ProductGallery";
import AddToCartForm from "./AddToCartForm";
import { Star } from "lucide-react";
import ReviewSection from "./ReviewSection";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Lấy chi tiết sản phẩm kèm đánh giá
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { isMain: 'desc' }
      },
      attributes: true,
      category: true,
      collection: true,
      reviews: {
        include: {
          user: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Tính điểm đánh giá trung bình
  const totalReviews = product.reviews.length;
  const avgRating = totalReviews > 0 
    ? (product.reviews.reduce((acc: number, rev: { rating: number }) => acc + rev.rating, 0) / totalReviews).toFixed(1)
    : "5.0"; // Mặc định nếu chưa có đánh giá

  // Định dạng title của breadcrumb
  const breadcrumbItems = [
    { label: product.category?.name || "Sản phẩm", href: `/products?category=${product.category?.slug || ""}` },
    { label: product.name }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[120px] pb-16">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 md:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            
            {/* Left: Gallery */}
            <div className="w-full lg:w-[45%] xl:w-1/2 flex-shrink-0">
              <ProductGallery images={product.images} />
            </div>

            {/* Right: Info */}
            <div className="flex-1 flex flex-col">
              
              {/* Product Header Info restored old style */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 mb-3">
                  {product.collection && (
                    <Link href={`/collections/${product.collection.slug}`} className="inline-block px-3 py-1 bg-teal-50 text-teal-700 font-bold text-[10px] uppercase tracking-widest rounded transition-colors">
                      {product.collection.name}
                    </Link>
                  )}
                  {product.productLine && (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 font-bold text-[10px] uppercase tracking-widest rounded">
                      Dòng {product.productLine}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                  {product.name}
                </h1>

                {/* Star Rating Display */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-500">
                    ({avgRating} / 5.0)
                  </span>
                </div>
                
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-black text-teal-600 tracking-tighter">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through font-medium mb-1">
                      {product.originalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                </div>
              </div>

              {/* Interactive AddToCart Form Component */}
              <AddToCartForm 
                productId={product.id}
                name={product.name}
                slug={product.slug}
                image={product.images.find((img: { url: string; isMain: boolean }) => img.isMain)?.url || product.images[0]?.url || ""}
                price={product.price} 
                stock={product.stock} 
              />

            </div>
          </div>
          
          {/* Bottom section (Optional Description) */}
          {product.description && (
            <div className="mt-12 pt-12 border-t border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight uppercase border-l-4 border-teal-600 pl-4">Mô tả sản phẩm</h2>
              <div className="prose max-w-none text-gray-600 space-y-4">
                {product.description.split(' | ').map((line: string, idx: number) => (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Review Section Functionality */}
          <ReviewSection 
            productId={product.id} 
            reviews={product.reviews} 
            avgRating={Number(avgRating)}
          />
        </div>
      </main>
    </div>
  );
}
