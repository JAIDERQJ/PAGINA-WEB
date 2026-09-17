"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export default function CartIndicator() {
  const totalItems = useCartStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <Link
      href="/carrito"
      className="font-pixel-ui inline-flex items-center gap-2 bg-rust text-white text-xs px-4 py-2.5 rounded-[6px] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-rust/40 hover:brightness-95 transition"
    >
      Carrito{mounted && totalItems > 0 ? ` (${totalItems})` : ""}
    </Link>
  );
}