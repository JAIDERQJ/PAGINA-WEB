import Link from "next/link";
import CartIndicator from "./CartIndicator";
import { STORE_NAME } from "@/lib/site-config";

export default function SiteHeader() {
  return (
    <header className="bg-bg sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-pixel-ui text-sm lowercase">
            {STORE_NAME}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/catalogo" className="font-pixel-ui text-xs hover:text-rust hover:underline underline-offset-4 transition-colors">
              Catálogo
            </Link>
            <Link href="/contacto" className="font-pixel-ui text-xs hover:text-rust hover:underline underline-offset-4 transition-colors">
              Contacto
            </Link>
            <Link href="/politicas" className="font-pixel-ui text-xs hover:text-rust hover:underline underline-offset-4 transition-colors">
              Cambios
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/catalogo" className="font-pixel-ui text-xs hidden sm:inline hover:text-rust">
              Ver catálogo
            </Link>
            <CartIndicator />
          </div>
        </div>
      </div>
    </header>
  );
}