import Link from "next/link";
import Image from "next/image";
import { formatCOP } from "@/lib/format";

export interface ProductCardData {
  slug: string;
  name: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  images: string[];
  stock: number;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const onSale = !!product.compareAtPrice;

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-cream overflow-hidden rounded-[12px] border border-line shadow-card">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
        {onSale && (
          <span className="absolute top-3 right-3 bg-rust text-white text-xs font-medium px-3 py-1.5 rounded-[6px]">
            Oferta
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-sm font-display">
            Agotado
          </div>
        )}
      </div>
      <div className="pt-3">
        <p className="text-sm font-medium">{product.name}</p>
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className={onSale ? "text-rust font-medium" : ""}>{formatCOP(product.price)}</span>
          {onSale && <span className="line-through text-muted/70">{formatCOP(product.compareAtPrice!)}</span>}
        </div>
      </div>
    </Link>
  );
}