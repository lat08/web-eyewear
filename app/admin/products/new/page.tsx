import ProductForm from "@/app/components/admin/ProductForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kilala Admin - New Product",
};

export default async function NewProductPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex-1 p-8 pt-6 bg-gray-50 min-h-screen">
      <ProductForm />
    </div>
  );
}
