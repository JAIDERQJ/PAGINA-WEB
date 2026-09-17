import { getActiveProducts, getCategories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const metadata = { title: "Catálogo" };

interface Props {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function CatalogPage({ searchParams }: Props) {
  const { categoria } = await searchParams;
  const [products, categories] = await Promise.all([
    getActiveProducts({ category: categoria }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl mb-6">Catálogo</h1>

      {categories.length > 1 && (
        <div className="flex gap-3 flex-wrap border-b border-line pb-6 mb-8">
          <Link
            href="/catalogo"
            className={`font-pixel-ui text-xs px-3 py-2 border rounded-[6px] ${
              !categoria ? "border-rust text-rust bg-cream" : "border-line text-ink"
            }`}
          >
            Todo
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/catalogo?categoria=${c}`}
              className={`font-pixel-ui text-xs px-3 py-2 border rounded-[6px] capitalize ${
                categoria === c ? "border-rust text-rust bg-cream" : "border-line text-ink"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-muted py-20 text-center">Aún no hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                slug: p.slug,
                name: p.name,
                price: p.price.toString(),
                compareAtPrice: p.compareAtPrice?.toString(),
                images: p.images,
                stock: p.stock,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}