"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartStore, lineKey } from "@/lib/cart-store";
import { formatCOP } from "@/lib/format";

const SHIPPING_COST = 12000;
const FREE_SHIPPING_THRESHOLD = 250000;

export default function CartPage() {
  const { lines, removeItem, setQuantity, subtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Guard de hidratación intencional: el carrito vive en localStorage y no
    // existe en el servidor, así que esperamos a montar en el navegador.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sub = subtotal();
  const shipping = sub === 0 || sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = sub + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl mb-4">Tu carrito está vacío</h1>
        <Link href="/catalogo" className="underline text-sm">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-6">
        <h1 className="font-display text-3xl mb-6">Carrito</h1>
        {lines.map((line) => {
          const k = lineKey(line);
          return (
            <div key={k} className="flex gap-4 border-b border-line pb-6">
              <div className="relative w-24 aspect-[3/4] bg-moss-soft shrink-0">
                {line.image && <Image src={line.image} alt={line.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <Link href={`/producto/${line.slug}`} className="text-sm hover:underline">{line.name}</Link>
                  <button onClick={() => removeItem(k)} className="text-sm text-muted hover:text-danger">
                    Eliminar
                  </button>
                </div>
                <p className="text-sm text-muted mt-1">
                  {[line.color, line.size].filter(Boolean).join(" / ")}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <select
                    value={line.quantity}
                    onChange={(e) => setQuantity(k, Number(e.target.value))}
                    className="border border-line px-2 py-1 text-sm bg-bg"
                  >
                    {Array.from({ length: Math.min(line.stock, 10) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span className="text-sm">{formatCOP(line.price * line.quantity)}</span>
                </div>
              </div>
            </div>
          );
        })}
        <Link href="/catalogo" className="text-sm underline">Continuar comprando</Link>
      </div>

      <div className="border border-line p-6 h-fit">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatCOP(sub)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Envío</span><span>{shipping === 0 ? "Gratis" : formatCOP(shipping)}</span></div>
          {shipping > 0 && (
            <p className="text-xs text-muted">Envío gratis en compras superiores a {formatCOP(FREE_SHIPPING_THRESHOLD)}.</p>
          )}
          <div className="flex justify-between border-t border-line pt-2 mt-2 text-base"><span>Total</span><span>{formatCOP(total)}</span></div>
        </div>
       <Link href="/checkout" className="font-pixel-ui block text-center bg-ink text-bg py-3.5 text-xs rounded-[6px] mt-6 hover:bg-rust transition-colors">
          Ir al checkout
        </Link>
      </div>
    </div>
  );
}
