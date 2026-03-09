"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function NewsletterForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Đã gửi thành công! Đội ngũ của chúng tôi sẽ liên hệ sớm nhất." });
        setFormData({ name: "", phone: "", email: "", message: "" });
        toast.success("Đã gửi tin nhắn thành công, vui lòng kiểm tra email của bạn!");
      } else {
        setStatus({ type: "error", message: data.error || "Có lỗi xảy ra, vui lòng thử lại sau." });
        toast.error("Có lỗi xảy ra: " + (data.error || "Không thể gửi email lúc này."));
      }
    } catch (error) {
      console.error("Form submit error", error);
      setStatus({ type: "error", message: "Không thể kết nối với máy chủ, vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-2 md:px-6">
      {status.message && (
        <div className={`p-3 rounded-lg text-sm font-medium text-left ${status.type === "success" ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-700"}`}>
          {status.message}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Họ và tên"
          className="w-full px-5 py-3 bg-gray-100 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
        />
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          placeholder="Số điện thoại"
          className="w-full px-5 py-3 bg-gray-100 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
        />
      </div>
      <input
        type="email"
        name="email"
        required
        value={formData.email}
        onChange={handleChange}
        placeholder="Email của bạn"
        className="w-full px-5 py-3 bg-gray-100 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow"
      />
      <textarea
        name="message"
        required
        value={formData.message}
        onChange={handleChange}
        placeholder="Lời nhắn của bạn (Ví dụ: Tư vấn độ cận -2.00, tư vấn mẫu lens tự nhiên...)"
        rows={3}
        className="w-full px-5 py-3 bg-gray-100 border-none rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-shadow resize-none"
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 mt-2 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-sm rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : "Gửi tin nhắn ngay"}
      </button>
    </form>
  );
}
