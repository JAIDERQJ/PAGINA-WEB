import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildWompiSignature } from "@/lib/wompi";
import { z } from "zod";

const lineSchema = z.object({
  productId: z.string(),
  name: z.string(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  price: z.number(),
  quantity: z.number().min(1),
});

const bodySchema = z.object({
  form: z.object({
    nombre: z.string().min(1),
    apellido: z.string().min(1),
    correo: z.string().email(),
    telefono: z.string().min(5),
    direccion: z.string().min(3),
    ciudad: z.string().min(2),
    departamento: z.string().min(2),
    notas: z.string().optional(),
  }),
  lines: z.array(lineSchema).min(1),
  shipping: z.number(),
  subtotal: z.number(),
  total: z.number(),
});

export async function POST(req: Request) {
  try {
    const { form, lines, shipping, subtotal, total } = bodySchema.parse(await req.json());

    // Verifica stock disponible
    const products = await prisma.product.findMany({
      where: { id: { in: lines.map((l) => l.productId) } },
    });
    for (const line of lines) {
      const p = products.find((x) => x.id === line.productId);
      if (!p || p.stock < line.quantity) {
        return NextResponse.json(
          { error: "No hay stock suficiente para uno de los productos." },
          { status: 400 }
        );
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customerName: `${form.nombre} ${form.apellido}`,
          customerEmail: form.correo,
          customerPhone: form.telefono,
          address: form.direccion,
          city: form.ciudad,
          department: form.departamento,
          notes: form.notas,
          subtotal,
          shipping,
          total,
          items: {
            create: lines.map((l) => ({
              productId: l.productId,
              name: l.name,
              size: l.size ?? undefined,
              color: l.color ?? undefined,
              quantity: l.quantity,
              unitPrice: l.price,
            })),
          },
        },
      });

      for (const line of lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      return created;
    });

    // Prepara los parámetros para el widget de Wompi (Web Checkout).
    // El monto se envía en centavos, como exige Wompi.
    const amountInCents = Math.round(total * 100);
    let wompi = null;
    if (process.env.WOMPI_PUBLIC_KEY && process.env.WOMPI_INTEGRITY_SECRET) {
      const signature = buildWompiSignature({ reference: order.id, amountInCents });
      wompi = {
        publicKey: process.env.WOMPI_PUBLIC_KEY,
        currency: "COP",
        amountInCents,
        reference: order.id,
        signature,
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/confirmacion?orderId=${order.id}`,
      };
    }

    return NextResponse.json({ orderId: order.id, wompi });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "No pudimos procesar tu pedido." }, { status: 400 });
  }
}
