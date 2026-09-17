import Link from "next/link";
import { STORE_NAME } from "@/lib/site-config";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ember text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-2 md:grid-cols-3 gap-10 text-sm">
        <div>
          <p className="font-pixel-ui text-sm lowercase mb-3">{STORE_NAME}</p>
          <p className="text-white/70 max-w-[26ch]">Ropa y productos con carácter, desde Bogotá.</p>
        </div>
        <div>
          <p className="mb-3 text-white/60 uppercase text-xs tracking-wide">Tienda</p>
          <ul className="space-y-2">
            <li><Link href="/catalogo" className="hover:underline">Catálogo</Link></li>
            <li><Link href="/politicas" className="hover:underline">Cambios y devoluciones</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-white/60 uppercase text-xs tracking-wide">Contacto</p>
          <ul className="space-y-2">
            <li><Link href="/contacto" className="hover:underline">Escríbenos</Link></li>
            <li className="text-white/70">Bogotá, Colombia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {STORE_NAME}.
      </div>
    </footer>
  );
}