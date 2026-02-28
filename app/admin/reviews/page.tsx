import ReviewsClient from "./ReviewsClient";

export const metadata = {
  title: "Kilala Admin - Reviews",
};

export default function AdminReviewsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Đánh Giá Từ Khách Hàng</h2>
      </div>
      <ReviewsClient />
    </div>
  );
}
