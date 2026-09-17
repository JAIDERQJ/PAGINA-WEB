"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCOP } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";

interface Props {
  product: {
    id: string;
    slug: string;
    name: string;
    price: string;
    compareAtPrice: string | null;
    image: string;
    sizes: string[];
    colors: string[];
    stock: number;
  };
}

export default function ProductBuyBox({ product }: Props) {
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(product.colors[0] ?? null);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const outOfStock = product.stock === 0;

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      size,
      color,
      price: parseFloat(product.price),
      quantity: 1,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/carrito");
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className={`text-xl ${product.compareAtPrice ? "text-danger" : ""}`}>
          {formatCOP(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="line-through text-muted">{formatCOP(product.compareAtPrice)}</span>
        )}
      </div>

      {product.colors.length > 0 && (
        <div className="mb-5">
          <p className="text-sm text-muted mb-2">Color</p>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-3 py-1.5 text-sm border ${color === c ? "border-ink bg-ink text-bg" : "border-line"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted mb-2">Talla</p>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-10 h-10 text-sm border ${size === s ? "border-ink bg-ink text-bg" : "border-line"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-muted mb-4">
        {outOfStock ? "Sin stock por ahora." : `${product.stock} disponibles`}
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="bg-ink text-bg py-3 text-sm disabled:opacity-40 hover:bg-moss transition-colors"
        >
          {added ? "Agregado ✓" : "Agregar al carrito"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="border border-ink py-3 text-sm disabled:opacity-40 hover:bg-moss-soft transition-colors"
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
}
