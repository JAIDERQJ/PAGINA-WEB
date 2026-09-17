import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-line">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <nav className="flex gap-6 text-sm">
            <Link href="/admin/productos" className="hover:text-muted">Productos</Link>
            <Link href="/admin/pedidos" className="hover:text-muted">Pedidos</Link>
          </nav>
          <LogoutButton />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
