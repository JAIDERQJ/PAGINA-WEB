import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size?: string | null;
  color?: string | null;
  price: number;
  quantity: number;
  stock: number;
}

// La clave de línea combina producto+talla+color (un mismo producto con distinta
// talla/color se trata como línea separada en el carrito).
function lineKey(l: Pick<CartLine, "productId" | "size" | "color">) {
  return `${l.productId}__${l.size ?? ""}__${l.color ?? ""}`;
}

interface CartState {
  lines: CartLine[];
  addItem: (line: CartLine) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  totalItems: () => number;
  key: typeof lineKey;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      key: lineKey,
      addItem: (line) =>
        set((state) => {
          const k = lineKey(line);
          const existing = state.lines.find((l) => lineKey(l) === k);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                lineKey(l) === k
                  ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.stock) }
                  : l
              ),
            };
          }
          return { lines: [...state.lines, line] };
        }),
      removeItem: (k) => set((state) => ({ lines: state.lines.filter((l) => lineKey(l) !== k) })),
      setQuantity: (k, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            lineKey(l) === k ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) } : l
          ),
        })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "tienda-cart" }
  )
);

export { lineKey };
