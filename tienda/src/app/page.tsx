import Link from "next/link";
import { getActiveProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";

export const revalidate = 60;

const carouselSlides = [
  {
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600",
    eyebrow: "Novedades",
    title: "Complementa tu look",
    subtitle: "Piezas nuevas para armar outfits que no pasan de moda.",
    ctaHref: "/catalogo?categoria=ropa",
  },
  {
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600",
    eyebrow: "Esenciales",
    title: "Todos los días",
    subtitle: "Básicos cómodos, hechos para durar cada temporada.",
    ctaHref: "/catalogo",
  },
  {
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600",
    eyebrow: "Ofertas",
    title: "Aprovecha ahora",
    subtitle: "Precios especiales por tiempo limitado.",
    ctaHref: "/catalogo?oferta=1",
  },
];

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <div>
      <section className="bg-bg">
        <div className="mx-auto max-w-2xl px-6 pt-20 pb-16 text-center flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl mb-8 leading-relaxed">
            <span className="block text-ink">Ropa con</span>
            <span className="block text-rust">carácter.</span>
          </h1>
          <p className="text-muted max-w-[42ch] mb-8 text-base">
            Colores cálidos, cortes simples y una vuelta a lo esencial. Sin modas de un solo mes.
          </p>
          <Link
            href="/catalogo"
            className="font-pixel-ui inline-flex items-center gap-2 bg-rust text-white px-8 py-3.5 rounded-[6px] text-xs ring-1 ring-rust/40 hover:brightness-95 transition"
          >
            Ver catálogo →
          </Link>
        </div>
      </section>

      <HeroCarousel slides={carouselSlides} />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-3xl">Productos</h2>
          <Link href="/catalogo" className="text-sm text-muted hover:underline">Ver todo</Link>
        </div>
        {products.length === 0 ? (
          <p className="text-muted">Pronto vas a encontrar aquí nuestros productos.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {products.slice(0, 8).map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  slug: p.slug,
                  name: p.name,
                  price: p.price.toString(),
                  compareAtPrice: p.compareAtPrice?.toString(),
                  images: p.images,
                  stock: p.stock,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-cream border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="bg-bg rounded-[12px] border border-line p-5 shadow-card">
            <p className="font-extrabold text-lg mb-1 text-rust">Envíos</p>
            <p className="text-muted">Entrega en 3–5 días hábiles a toda Colombia.</p>
          </div>
          <div className="bg-bg rounded-[12px] border border-line p-5 shadow-card">
            <p className="font-extrabold text-lg mb-1 text-rust">Cambios</p>
            <p className="text-muted">30 días para cambios y devoluciones.</p>
          </div>
          <div className="bg-bg rounded-[12px] border border-line p-5 shadow-card">
            <p className="font-extrabold text-lg mb-1 text-rust">Pago seguro</p>
            <p className="text-muted">Procesado por una pasarela certificada.</p>
          </div>
        </div>
      </section>
    </div>
  );
}