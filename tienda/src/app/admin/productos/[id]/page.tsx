import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Editar producto</h1>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          category: product.category,
          images: product.images,
          sizes: product.sizes,
          colors: product.colors,
          stock: product.stock,
          isActive: product.isActive,
        }}
      />
    </div>
  );
}
