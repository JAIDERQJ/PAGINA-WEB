import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import ProductBuyBox from "@/components/ProductBuyBox";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-12">
      <ProductGallery images={product.images} name={product.name} />

      <div>
        <p className="text-muted text-sm mb-1 capitalize">{product.category}</p>
        <h1 className="font-display text-3xl mb-4">{product.name}</h1>

        <ProductBuyBox
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price.toString(),
            compareAtPrice: product.compareAtPrice?.toString() ?? null,
            image: product.images[0] ?? "",
            sizes: product.sizes,
            colors: product.colors,
            stock: product.stock,
          }}
        />

        <div className="border-t border-line mt-10 pt-6 text-sm space-y-4">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
