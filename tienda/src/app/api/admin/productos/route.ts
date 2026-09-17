import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(1),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().nullable().optional(),
  category: z.string().min(1),
  images: z.array(z.string().url()),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  stock: z.number().int().min(0),
  isActive: z.boolean().optional(),
});

function requireAdmin(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/admin_session=([^;]+)/);
  return match?.[1] === process.env.ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const data = productSchema.parse(await req.json());
    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    let n = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${++n}`;
    }
    const product = await prisma.product.create({ data: { ...data, slug } });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }
}
