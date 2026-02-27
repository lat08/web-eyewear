"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi");
      }

      setMessage(data.message);
      if (data.devLink) setDevLink(data.devLink);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-[120px]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-md shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Quên Mật Khẩu</h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập email của bạn để nhận mã khôi phục
          </p>
        </div>

        {message ? (
          <div className="space-y-6">
            <div className="bg-teal-50 text-teal-700 p-6 rounded-md border border-teal-100 flex flex-col items-center text-center animate-fadeIn">
              <CheckCircle size={48} className="mb-4 text-teal-500" />
              <p className="font-bold mb-2">Yêu cầu đã được gửi!</p>
              <p className="text-sm">{message}</p>
            </div>
            
            {devLink && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
                <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">Môi trường Dev (Reset Link):</p>
                <Link href={devLink} className="text-xs text-blue-600 break-all hover:underline">
                  {devLink}
                </Link>
              </div>
            )}

            <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
              <ArrowLeft size={16} /> Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-100 animate-fadeIn">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Email tài khoản</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-teal-600 text-white rounded-md font-bold uppercase tracking-widest text-sm hover:bg-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang gửi..." : "Gửi yêu cầu khôi phục"}
            </button>

            <div className="text-center">
              <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-teal-600 transition-colors">
                <ArrowLeft size={16} /> Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
