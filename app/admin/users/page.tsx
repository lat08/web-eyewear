import UsersClient from "./UsersClient";

export const metadata = {
  title: "Kilala Admin - Users",
};

export default function AdminUsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tài Khoản Người Dùng</h2>
      </div>
      <UsersClient />
    </div>
  );
}
