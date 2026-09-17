import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Imágenes de prueba (Unsplash) — REEMPLAZAR por fotografías reales antes de vender.
const products = [
  {
    name: "Camiseta básica",
    slug: "camiseta-basica",
    description: "Camiseta 100% algodón peinado, corte regular. Un básico que no pasa de moda.",
    price: 79900,
    compareAtPrice: null,
    category: "ropa",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
    sizes: ["S", "M", "L"],
    colors: ["Negro", "Blanco"],
    stock: 25,
  },
  {
    name: "Hoodie oversize",
    slug: "hoodie-oversize",
    description: "Hoodie de felpa gruesa, corte oversize, bolsillo canguro.",
    price: 189900,
    compareAtPrice: 229900,
    category: "ropa",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"],
    sizes: ["S", "M", "L"],
    colors: ["Negro", "Mostaza"],
    stock: 15,
  },
  {
    name: "Pantalón recto",
    slug: "pantalon-recto",
    description: "Pantalón de tiro medio, corte recto, tela con leve stretch.",
    price: 149900,
    compareAtPrice: null,
    category: "ropa",
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"],
    sizes: ["S", "M", "L"],
    colors: ["Café", "Negro"],
    stock: 18,
  },
  {
    name: "Gorra clásica",
    slug: "gorra-clasica",
    description: "Gorra de six panels, ajuste con hebilla trasera.",
    price: 59900,
    compareAtPrice: null,
    category: "accesorios",
    images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800"],
    sizes: [],
    colors: ["Mostaza", "Terracota"],
    stock: 30,
  },
  {
    name: "Chaqueta acolchada",
    slug: "chaqueta-acolchada",
    description: "Chaqueta ligera acolchada, resistente al viento, ideal de entretiempo.",
    price: 259900,
    compareAtPrice: 299900,
    category: "ropa",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"],
    sizes: ["S", "M", "L"],
    colors: ["Terracota"],
    stock: 10,
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`Seed completado: ${products.length} productos creados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
