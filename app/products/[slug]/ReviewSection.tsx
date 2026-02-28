"use client";

import { useState, useEffect } from "react";
import { Star, User as UserIcon, Send, AlertCircle, ShoppingCart, Lock, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
  };
};

export default function ReviewSection({ 
  productId, 
  reviews: initialReviews,
  avgRating 
}: { 
  productId: number; 
  reviews: Review[];
  avgRating: number;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [eligibility, setEligibility] = useState<{ canReview: boolean; reason?: string }>({ canReview: false });
  const [isChecking, setIsChecking] = useState(true);

  // Rating breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  // Check if user can review this product
  useEffect(() => {
    const checkEligibility = async () => {
      if (!session) {
        setEligibility({ canReview: false, reason: "LOGIN_REQUIRED" });
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`);
        const data = await response.json();
        setEligibility(data);
      } catch (error) {
        console.error("Error checking review eligibility:", error);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkEligibility();
  }, [productId, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !eligibility.canReview) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi");
      }

      setReviews([data.review, ...reviews]);
      setComment("");
      setRating(5);
      setShowForm(false);
      setEligibility({ canReview: false, reason: "ALREADY_REVIEWED" });
      router.refresh();
      alert("Cảm ơn bạn đã gửi đánh giá!");
    } catch (error: any) {
      alert(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isChecking) return "Đang kiểm tra...";
    if (showForm) return "Đóng form";
    if (!session) return "Đăng nhập để đánh giá";
    if (!eligibility.canReview) {
      switch (eligibility.reason) {
        case "ALREADY_REVIEWED": return "Bạn đã đánh giá rồi";
        case "ORDER_NOT_DELIVERED": return "Đơn hàng chưa hoàn tất";
        case "NOT_PURCHASED": return "Mua hàng để đánh giá";
        default: return "Viết đánh giá";
      }
    }
    return "Viết đánh giá của bạn";
  };

  const getEligibilityMessage = () => {
    if (!session || eligibility.canReview || isChecking) return null;
    
    switch (eligibility.reason) {
      case "ALREADY_REVIEWED":
        return (
          <div className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-3 rounded-md border border-teal-100 mb-6 text-sm font-bold animate-fadeIn">
            <CheckCircle2 size={16} /> Bạn đã gửi đánh giá cho sản phẩm này. Mỗi sản phẩm chỉ có thể đánh giá một lần.
          </div>
        );
      case "ORDER_NOT_DELIVERED":
        return (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-md border border-amber-100 mb-6 text-sm font-bold animate-fadeIn">
            <AlertCircle size={16} /> Đơn hàng chứa sản phẩm này đang được xử lý. Bạn có thể đánh giá sau khi được xác nhận giao hàng thành công.
          </div>
        );
      case "NOT_PURCHASED":
        return (
          <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-3 rounded-md border border-gray-100 mb-6 text-sm font-bold animate-fadeIn">
            <ShoppingCart size={16} /> Chỉ những khách hàng đã mua sản phẩm này và nhận hàng thành công mới có thể để lại đánh giá.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-gray-100">
      <div className="flex flex-col md:flex-row gap-10 mb-12">
        {/* Rating Summary Card */}
        <div className="w-full md:w-1/3 bg-gray-50 p-8 rounded-xl border border-gray-100 text-center flex flex-col items-center justify-center">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Đánh giá trung bình</p>
          <h3 className="text-5xl font-black text-gray-900 mb-4">{avgRating}</h3>
          <div className="flex gap-1 mb-3">
             {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={20} 
                  className={i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                />
              ))}
          </div>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-tight">{reviews.length} đánh giá đã xác thực</p>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 space-y-3 flex flex-col justify-center">
           {ratingCounts.map(({ star, count, percentage }) => (
             <div key={star} className="flex items-center gap-4 group">
                <span className="w-12 text-sm font-bold text-gray-500 flex items-center gap-1">
                  {star} <Star size={12} className="fill-gray-400 text-gray-400" />
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-amber-400 transition-all duration-1000 ease-out" 
                     style={{ width: `${percentage}%` }}
                   />
                </div>
                <span className="w-8 text-xs font-bold text-gray-400 text-right">{count}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-xl font-black text-gray-900 uppercase border-l-4 border-teal-600 pl-4">
            Chi tiết đánh giá
          </h2>
        </div>

        <button
          onClick={() => {
            if (!session) {
              router.push("/login");
              return;
            }
            if (eligibility.canReview) {
              if (showForm) {
                 setShowForm(false);
              } else {
                 setShowForm(true);
                 // Scroll to form
                 setTimeout(() => {
                   document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                 }, 100);
              }
            }
          }}
          className={`px-6 py-3 text-xs font-black uppercase tracking-widest rounded-md transition-all shadow-md active:scale-95 flex items-center gap-2 ${
            showForm 
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
              : !session
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : eligibility.canReview 
                  ? "bg-gray-900 text-white hover:bg-teal-700" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          {!session && <Lock size={14} />}
          {getButtonText()}
        </button>
      </div>

      {/* Review Eligibility Messaging */}
      {getEligibilityMessage()}

      {/* Review Form */}
      {showForm && eligibility.canReview && (
        <div id="review-form" className="mb-12 bg-white p-8 rounded-xl border-2 border-teal-50 shadow-xl animate-fadeIn">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3">
             <Star className="text-teal-600 fill-teal-600" size={20} /> Chia sẻ trải nghiệm của bạn
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Sản phẩm này xứng đáng mấy sao?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="transition-all active:scale-125 hover:scale-110"
                  >
                    <Star 
                      size={36} 
                      className={s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} 
                    />
                  </button>
                ))}
                <span className="ml-4 flex items-center text-sm font-bold text-amber-500 uppercase tracking-widest">
                   {rating === 5 ? "Rất hài lòng" : rating === 4 ? "Hài lòng" : rating === 3 ? "Bình thường" : rating === 2 ? "Không hài lòng" : "Rất kém"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Cảm nhận của bạn về sản phẩm:</label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-5 border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white text-sm font-medium transition-all"
                rows={5}
                placeholder="Nhập cảm nhận của bạn tại đây... (Ví dụ: Màu lens rất tự nhiên, đeo cả ngày không bị khô mắt)"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-3 px-10 py-4 bg-teal-600 text-white font-black text-xs uppercase tracking-widest rounded-md hover:bg-teal-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-teal-200"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>ĐĂNG NHẬN XÉT <Send size={14} /></>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200 shadow-sm">
               <Star size={32} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Chưa có đánh giá nào cho sản phẩm này.</p>
            <p className="text-gray-300 text-[11px] mt-1">Hãy là người đầu tiên trải nghiệm và để lại nhận xét!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex gap-6 pb-10 border-b border-gray-100 last:border-0 group">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-50 to-gray-50 border border-gray-100 flex items-center justify-center text-teal-600 shadow-sm group-hover:from-teal-100 transition-colors">
                  <UserIcon size={24} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{review.user?.name || "Người dùng Kilala"}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded text-[9px] font-black text-teal-600 uppercase">
                       <CheckCircle2 size={10} /> Đã mua hàng
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="flex mb-4 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"} 
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-4 rounded-lg border border-gray-50 group-hover:bg-white group-hover:border-teal-50 transition-all">
                  {review.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
