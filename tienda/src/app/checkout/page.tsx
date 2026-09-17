"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatCOP } from "@/lib/format";

const SHIPPING_COST = 12000;
const FREE_SHIPPING_THRESHOLD = 250000;

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    nombre: "", apellido: "", correo: "", telefono: "",
    direccion: "", ciudad: "", departamento: "", notas: "",
  });

  if (!mounted) return null;
  if (lines.length === 0) {
    router.push("/carrito");
    return null;
  }

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = sub + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          lines: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            size: l.size,
            color: l.color,
            price: l.price,
            quantity: l.quantity,
          })),
          shipping,
          subtotal: sub,
          total,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "No pudimos procesar tu pedido.");
      }
      const { orderId, wompi } = await res.json();

      if (wompi) {
        // Abre el widget oficial de Wompi (WidgetCheckout). Es la integración
        // recomendada por Wompi: https://docs.wompi.co/docs/colombia/widget-checkout-web/
        await openWompiWidget(wompi);
        clear();
        router.push(`/checkout/confirmacion?orderId=${orderId}`);
      } else {
        // Pasarela aún no configurada — el pedido queda registrado como pendiente de pago.
        clear();
        router.push(`/checkout/confirmacion?orderId=${orderId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
      setLoading(false);
    }
  }

  async function openWompiWidget(wompi: {
    publicKey: string;
    currency: string;
    amountInCents: number;
    reference: string;
    signature: string;
    redirectUrl: string;
  }) {
    await loadWompiScript();
    return new Promise<void>((resolve) => {
      // @ts-expect-error -- WidgetCheckout se inyecta globalmente por el script de Wompi
      const checkout = new window.WidgetCheckout({
        currency: wompi.currency,
        amountInCents: wompi.amountInCents,
        reference: wompi.reference,
        publicKey: wompi.publicKey,
        signature: { integrity: wompi.signature },
        redirectUrl: wompi.redirectUrl,
      });
      checkout.open(() => resolve());
    });
  }

  function loadWompiScript() {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById("wompi-widget-script")) return resolve();
      const script = document.createElement("script");
      script.id = "wompi-widget-script";
      script.src = "https://checkout.wompi.co/widget.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("No pudimos cargar la pasarela de pago."));
      document.body.appendChild(script);
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 grid md:grid-cols-3 gap-12">
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
        <h1 className="font-display text-3xl mb-6">Checkout</h1>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
          <Field label="Apellido" value={form.apellido} onChange={(v) => setForm({ ...form, apellido: v })} />
        </div>
        <Field label="Correo" type="email" value={form.correo} onChange={(v) => setForm({ ...form, correo: v })} />
        <Field label="Teléfono" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
        <Field label="Dirección" value={form.direccion} onChange={(v) => setForm({ ...form, direccion: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ciudad" value={form.ciudad} onChange={(v) => setForm({ ...form, ciudad: v })} />
          <Field label="Departamento" value={form.departamento} onChange={(v) => setForm({ ...form, departamento: v })} />
        </div>
        <label className="block text-sm">
          <span className="text-muted block mb-1">Notas (opcional)</span>
          <textarea
            value={form.notas}
            onChange={(e) => setForm({ ...form, notas: e.target.value })}
            className="w-full border border-line px-3 py-2 bg-bg"
            rows={2}
          />
        </label>

        {error && <p className="text-danger text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-bg py-3 text-sm mt-4 hover:bg-moss transition-colors disabled:opacity-50"
        >
          {loading ? "Redirigiendo al pago..." : "Ir a pagar"}
        </button>
        <p className="text-xs text-muted">
          No almacenamos datos de tarjetas. El pago se procesa en Wompi, una pasarela certificada.
        </p>
      </form>

      <div className="border border-line p-6 h-fit space-y-3 text-sm">
        {lines.map((l) => (
          <div key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between">
            <span>{l.name} ({[l.color, l.size].filter(Boolean).join(" / ")}) × {l.quantity}</span>
            <span>{formatCOP(l.price * l.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-line pt-3 flex justify-between"><span className="text-muted">Subtotal</span><span>{formatCOP(sub)}</span></div>
        <div className="flex justify-between"><span className="text-muted">Envío</span><span>{shipping === 0 ? "Gratis" : formatCOP(shipping)}</span></div>
        <div className="flex justify-between text-base border-t border-line pt-2"><span>Total</span><span>{formatCOP(total)}</span></div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-muted block mb-1">{label}</span>
      <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-line px-3 py-2 bg-bg" />
    </label>
  );
}
