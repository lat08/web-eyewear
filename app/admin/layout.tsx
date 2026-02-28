import AdminHeader from "@/app/components/admin/AdminHeader";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export const metadata = {
  title: "Kilala Eye - Admin Dashboard",
  description: "Trang quản trị dành riêng cho Ban Quản Trị Hệ Thống",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top Header */}
        <AdminHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
