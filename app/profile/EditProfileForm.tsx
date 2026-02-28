"use client";

import { useState } from "react";
import { User, Phone, MapPin, CheckCircle2, X, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi khi cập nhật");
      }

      setSuccess(true);
      setIsEditing(false);
      router.refresh();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-4 pt-6 border-t border-gray-50 text-left">
        {success && (
          <div className="bg-teal-50 text-teal-700 p-3 rounded-md text-[13px] font-bold border border-teal-100 flex items-center gap-2 mb-4 animate-fadeIn">
            <CheckCircle2 color="#0d9488" size={16} /> Thông tin đã được cập nhật
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
            <User size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Họ và tên</p>
            <p className="text-sm font-bold text-gray-800">{user.name || "Chưa cập nhật"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
            <p className="text-sm font-bold text-gray-800">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
            <Phone size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số điện thoại</p>
            <p className="text-sm font-bold text-gray-800">{user.phone || "Chưa cập nhật"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Địa chỉ mặc định</p>
            <p className="text-sm font-bold text-gray-800">{user.address || "Chưa cập nhật"}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 w-full py-2.5 px-4 text-xs font-bold text-teal-600 border border-teal-200 rounded-md hover:bg-teal-50 transition-all uppercase tracking-widest"
        >
          Chỉnh sửa thông tin
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4 pt-6 border-t border-gray-50 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.15em]">Cập nhật thông tin</h3>
        <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-[11px] font-bold border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Họ và tên</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full text-sm font-bold bg-gray-50 border border-gray-100 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Số điện thoại</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09xxx..."
          className="w-full text-sm font-bold bg-gray-50 border border-gray-100 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Địa chỉ mặc định</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder="Số nhà, Tên đường..."
          className="w-full text-sm font-bold bg-gray-50 border border-gray-100 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="py-2.5 px-4 text-[11px] font-bold text-gray-400 border border-gray-100 rounded-md hover:bg-gray-50 transition-all uppercase tracking-widest"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="py-2.5 px-4 text-[11px] font-bold text-white bg-teal-600 rounded-md hover:bg-teal-700 shadow-md transition-all uppercase tracking-widest disabled:opacity-50"
        >
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
