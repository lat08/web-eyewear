import Image from "next/image";
import Breadcrumb from "@/app/components/Breadcrumb";
import { ShieldCheck, AlertCircle, RefreshCw, Truck, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function WarrantyPage() {
  const breadcrumbItems = [{ label: "Chính sách bảo hành", href: "/warranty" }];

  return (
    <div className="min-h-screen bg-gray-50 pt-[160px] pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8 bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-teal-600 px-8 py-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
                Chính Sách Bảo Hành
              </h1>
              <p className="text-teal-50 font-medium max-w-2xl mx-auto opacity-90 leading-relaxed">
                Kilala Eye cam kết mang lại sự an tâm tuyệt đối cho khách hàng với chính sách hỗ trợ và bảo trì sản phẩm minh bạch, tận tâm.
              </p>
            </div>
            <ShieldCheck size={200} className="absolute -right-20 -bottom-20 text-white/10 rotate-12" />
          </div>

          <div className="p-8 md:p-12 space-y-16">
            {/* Section I: CHÍNH SÁCH BẢO HÀNH */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-md bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                  I. Chính sách bảo hành
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-md border-l-4 border-teal-600">
                  <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Sản phẩm thông thường</p>
                  <p className="text-gray-900 font-bold">Bảo hành 7 ngày kể từ ngày nhận hàng với lỗi do nhà sản xuất.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-md border-l-4 border-amber-500">
                  <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">Sản phẩm SALE / FLASH SALE</p>
                  <p className="text-gray-900 font-bold">Bảo hành 24h kể từ lúc nhận hàng đối với lỗi do nhà sản xuất.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* NHẬN bảo hành */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-teal-600 font-black uppercase tracking-widest text-sm">
                    <CheckCircle2 size={18} /> ĐƯỢC CHẤP NHẬN BẢO HÀNH
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Lens gây cộm, ngứa, đỏ mắt, chảy nước mắt liên tục mặc dù đã thực hiện đúng hướng dẫn và bề mặt lens không rách/xước.",
                      "Lens lỗi do nhà sản xuất: rách, xước, dính đáy lọ, bị gập dính (đối với trường hợp chưa khui lọ).",
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-600 leading-relaxed italic">
                        <span className="text-teal-600 font-black shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-teal-50 p-4 rounded text-xs text-teal-700 font-bold border border-teal-100 leading-relaxed">
                    <AlertCircle size={14} className="inline mr-1 mb-0.5" /> 
                    Quý khách vui lòng kiểm tra kỹ sản phẩm qua đáy lọ hoặc vỉ lens trước khi khui sản phẩm.
                  </div>
                </div>

                {/* KHÔNG NHẬN bảo hành */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-sm">
                    <XCircle size={18} /> TỪ CHỐI BẢO HÀNH
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Sản phẩm sale >20%, flash sale, quà tặng kèm theo.",
                      "Sản phẩm đã quá hạn bảo hành theo quy định.",
                      "Vấn đề do người dùng hoặc ngoại cảnh sau khi đã khui lọ.",
                      "Lens mờ do sai độ cận hoặc vệ sinh không đúng cách.",
                      "Sử dụng nước ngâm/nhỏ mắt không chuyên dụng.",
                      "Đeo ngược lens hoặc dính vật thể lạ (mascara, bụi, côn trùng...).",
                      "Sản phẩm bị rách, xước, lẹm sau khi đã khui lọ.",
                      "Màu lens không hợp hoặc kích thước không vừa mắt.",
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-xs text-gray-600 leading-relaxed font-medium">
                        <span className="text-red-500 font-extrabold shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Section II: QUY ĐỊNH ĐỔI TRẢ */}
            <section className="pt-12 border-t border-gray-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-md bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <RefreshCw size={28} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                  II. Quy định đổi trả
                </h2>
              </div>

              {/* Lệ phí */}
              <div className="mb-12">
                <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                  <Truck size={18} className="text-teal-600" /> Phí vận chuyển & Đổi trả
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded italic text-sm">
                    <span className="font-bold text-gray-700">Lỗi do Kilala Eye (Gửi sai mẫu/độ):</span>
                    <span className="text-teal-600 font-black uppercase">Kilala chịu 100% chi phí</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded italic text-sm">
                    <span className="font-bold text-gray-700">Lỗi do nhà sản xuất (Cộm, xước):</span>
                    <span className="text-gray-900 font-black uppercase">Đổi mới sản phẩm - Khách trả ship</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded italic text-sm">
                    <span className="font-bold text-gray-700">Lỗi từ phía khách hàng:</span>
                    <span className="text-red-600 font-black uppercase">Khách hàng chịu 100% chi phí</span>
                  </div>
                </div>
              </div>

              {/* Thời gian */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="bg-teal-600 text-white p-8 rounded-md shadow-lg relative">
                  <Clock size={80} className="absolute -right-4 -bottom-4 opacity-10" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-80">Thời gian quy định</h3>
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black">03</span>
                      <span className="text-xl font-bold uppercase">Ngày</span>
                    </div>
                    <p className="text-sm font-medium opacity-90 leading-relaxed italic">
                      Kể từ ngày nhận hàng. Mỗi đơn hàng đủ điều kiện được đổi trả tối đa 01 lần.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">
                    Hình thức hoàn tất
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Sẽ đổi mới sản phẩm cho khách hàng. Trường hợp <span className="text-gray-900 font-bold">hết hàng trong kho</span>, Kilala Eye cam kết hoàn phí 100% qua chuyển khoản hoặc tiền mặt.
                  </p>
                  <p className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 p-3 rounded">
                    Kilala không nhận trả hàng, hoàn tiền cho các trường hợp không thuộc điều kiện đổi trả.
                  </p>
                </div>
              </div>

              {/* Conditions Table */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 border border-teal-100 rounded-md bg-teal-50/30">
                  <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-4">Nhận đổi mới khi:</h4>
                  <ul className="text-xs text-gray-600 space-y-3 list-disc pl-4 italic">
                    <li>Giao sai độ cận, sai mẫu (Sản phẩm còn nguyên đai, chưa khui).</li>
                    <li>Hàng hư hỏng do vận chuyển của shop.</li>
                    <li>Sản phẩm gặp các lỗi kỹ thuật ở mục I.</li>
                  </ul>
                </div>
                <div className="p-6 border border-red-50 rounded-md bg-red-50/20">
                  <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4">Từ chối đổi mới khi:</h4>
                  <ul className="text-xs text-gray-500 space-y-3 list-disc pl-4 italic leading-relaxed">
                    <li>Lỗi từ phía đơn vị vận chuyển (Shop hỗ trợ khiếu nại).</li>
                    <li>Khách muốn đổi sang mẫu khác sau khi shop đã giao đúng.</li>
                    <li>Quá hạn đổi trả theo quy định.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Footer of the content */}
          <div className="p-8 bg-gray-50 text-center border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">
              Kilala Eye - Trân trọng đôi mắt bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
