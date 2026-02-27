import Link from "next/link";
import { Home, ArrowLeft, Search, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pt-[120px]">
      <div className="text-center">
        <h1 className="text-9xl font-black text-teal-600 mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-3xl font-black text-gray-900 uppercase mb-4">
          SAI ĐƯỜNG RỒI!
        </h2>
        <p className="text-gray-500 font-medium mb-12 max-w-sm mx-auto">
          Trang bạn tìm không tồn tại hoặc đã bị di chuyển. Hãy quay lại trang chủ nhé!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-teal-600 text-white font-bold uppercase tracking-widest text-xs rounded hover:bg-teal-700 transition-colors"
          >
            Về Trang Chủ
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 border border-gray-300 text-gray-700 font-bold uppercase tracking-widest text-xs rounded hover:border-teal-600 hover:text-teal-600 transition-colors"
          >
            Tìm Sản Phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
