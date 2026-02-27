"use client";

import { useState } from "react";
import { Star, User as UserIcon, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setIsSubmitting(true);
    try {
      // Logic gửi review sẽ ở đây (tạo API /api/reviews)
      // Hiện tại ta sẽ giả lập thêm vào state để user thấy ngay
      const newReview: Review = {
        id: Date.now(),
        rating,
        comment,
        createdAt: new Date(),
        user: { name: session.user?.name || "Người dùng" }
      };
      
      setReviews([newReview, ...reviews]);
      setComment("");
      setRating(5);
      setShowForm(false);
      alert("Cảm ơn bạn đã gửi đánh giá!");
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-xl font-black text-gray-900 uppercase border-l-4 border-teal-600 pl-4 mb-2">
            Đánh giá từ khách hàng
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  className={i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-bold">
              {reviews.length} đánh giá
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-teal-700 transition-all shadow-md active:scale-95"
        >
          {showForm ? "Đóng form" : "Viết đánh giá của bạn"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-12 bg-gray-50 p-6 rounded-md border border-gray-100 animate-fadeIn">
          {!session ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">Vui lòng đăng nhập để gửi đánh giá của bạn</p>
              <Link href="/login" className="text-teal-600 font-bold hover:underline">Đăng nhập ngay »</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Điểm đánh giá:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="transition-transform active:scale-125"
                    >
                      <Star 
                        size={28} 
                        className={s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Bình luận của bạn:</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white text-sm"
                  rows={4}
                  placeholder="Sản phẩm rất tuyệt vời, đeo êm mắt..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white font-bold text-xs uppercase tracking-widest rounded-md hover:bg-teal-700 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? "Đang gửi..." : (
                  <>Gửi đánh giá <Send size={14} /></>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-gray-50/50 rounded-md border border-dashed border-gray-200">
            <p className="text-gray-500 italic">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex gap-4 pb-8 border-b border-gray-50 last:border-0">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                  <UserIcon size={20} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 text-sm">{review.user?.name || "Người dùng"}</h4>
                  <span className="text-[11px] text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
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
