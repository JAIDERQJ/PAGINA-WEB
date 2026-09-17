"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isActive: boolean;
}

const EMPTY: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  compareAtPrice: null,
  category: "ropa",
  images: [""],
  sizes: [],
  colors: [],
  stock: 0,
  isActive: true,
};

export default function ProductForm({ initial }: { initial?: ProductFormData }) {
  const [form, setForm] = useState<ProductFormData>(initial ?? EMPTY);
  const [sizesText, setSizesText] = useState((initial?.sizes ?? []).join(", "));
  const [colorsText, setColorsText] = useState((initial?.colors ?? []).join(", "));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...form,
      images: form.images.filter((i) => i.trim() !== ""),
      sizes: sizesText.split(",").map((s) => s.trim()).filter(Boolean),
      colors: colorsText.split(",").map((c) => c.trim()).filter(Boolean),
    };

    const url = form.id ? `/api/admin/productos/${form.id}` : "/api/admin/productos";
    const method = form.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      setError("No pudimos guardar el producto. Revisa los campos.");
      return;
    }
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <Field label="Nombre" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />

      <label className="block text-sm">
        <span className="text-muted block mb-1">Descripción</span>
        <textarea
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-line px-3 py-2 bg-bg"
          rows={4}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Precio (COP)"
          type="number"
          value={String(form.price)}
          onChange={(v) => setForm({ ...form, price: Number(v) })}
        />
        <Field
          label="Precio anterior (opcional)"
          type="number"
          value={form.compareAtPrice ? String(form.compareAtPrice) : ""}
          onChange={(v) => setForm({ ...form, compareAtPrice: v ? Number(v) : null })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoría" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
        <Field
          label="Stock"
          type="number"
          value={String(form.stock)}
          onChange={(v) => setForm({ ...form, stock: Number(v) })}
        />
      </div>

      <Field
        label="Tallas (separadas por coma, opcional)"
        value={sizesText}
        onChange={setSizesText}
        placeholder="S, M, L"
      />
      <Field
        label="Colores (separados por coma, opcional)"
        value={colorsText}
        onChange={setColorsText}
        placeholder="Negro, Blanco"
      />

      <div>
        <span className="text-muted block mb-1 text-sm">Imágenes (URLs, una por línea)</span>
        <textarea
          value={form.images.join("\n")}
          onChange={(e) => setForm({ ...form, images: e.target.value.split("\n") })}
          className="w-full border border-line px-3 py-2 bg-bg text-sm"
          rows={3}
          placeholder="https://..."
        />
        <p className="text-xs text-muted mt-1">
          Sube tus fotos a Cloudinary o Vercel Blob y pega aquí la URL pública. La primera imagen es la principal.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
        />
        Visible en la tienda
      </label>

      {error && <p className="text-danger text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-ink text-bg px-6 py-3 text-sm hover:bg-moss transition-colors disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-muted block mb-1">{label}</span>
      <input
        required={!placeholder}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line px-3 py-2 bg-bg"
      />
    </label>
  );
}
