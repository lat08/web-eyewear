import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Kilala Admin - Orders",
};

export default function AdminOrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Đơn Hàng (Orders)</h2>
      </div>
      <OrdersClient />
    </div>
  );
}
