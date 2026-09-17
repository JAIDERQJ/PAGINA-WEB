import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/format";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Productos</h1>
        <Link href="/admin/productos/nuevo" className="bg-ink text-bg px-4 py-2 text-sm hover:bg-moss">
          + Nuevo producto
        </Link>
      </div>

      <div className="border border-line">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 text-xs text-muted border-b border-line">
          <span>Producto</span>
          <span>Precio</span>
          <span>Stock</span>
          <span>Activo</span>
          <span></span>
        </div>
        {products.map((p) => (
          <div key={p.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 items-center text-sm border-b border-line last:border-b-0">
            <div>
              <p>{p.name}</p>
              <p className="text-muted text-xs capitalize">{p.category}</p>
            </div>
            <span>{formatCOP(p.price.toString())}</span>
            <span className={p.stock === 0 ? "text-danger" : ""}>{p.stock}</span>
            <span>{p.isActive ? "Sí" : "No"}</span>
            <div className="flex gap-3">
              <Link href={`/admin/productos/${p.id}`} className="underline">Editar</Link>
              <DeleteProductButton id={p.id} name={p.name} />
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-muted text-sm px-4 py-8 text-center">Aún no has creado productos.</p>
        )}
      </div>
    </div>
  );
}
