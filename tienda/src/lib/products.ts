import { prisma } from "@/lib/prisma";

export async function getActiveProducts(opts?: { category?: string; q?: string }) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      category: opts?.category ? opts.category : undefined,
      name: opts?.q ? { contains: opts.q, mode: "insensitive" } : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function getCategories() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { category: true },
    distinct: ["category"],
  });
  return products.map((p) => p.category);
}
