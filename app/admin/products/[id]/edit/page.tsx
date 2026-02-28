import ProductForm from "@/app/components/admin/ProductForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Kilala Admin - Edit Product",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") {
    redirect("/");
  }

  const productId = parseInt((await params).id, 10);
  if (isNaN(productId)) {
    redirect("/admin/products");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: { isMain: 'desc' },
      },
      tags: {
        select: { tagId: true }
      }
    }
  });

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="flex-1 p-8 pt-6 bg-gray-50 min-h-screen">
      <ProductForm initialData={product} />
    </div>
  );
}
