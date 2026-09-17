import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Configura esta URL en tu panel de Wompi como "Webhook de eventos":
// https://tudominio.com/api/webhooks/wompi
// Doc oficial: https://docs.wompi.co/docs/colombia/eventos/

export async function POST(req: Request) {
  const payload = await req.json();
  const secret = process.env.WOMPI_EVENTS_SECRET;

  if (secret) {
    const properties: string[] = payload.signature?.properties ?? [];
    const concatenated = properties
      .map((p) =>
        p.split(".").reduce((obj: unknown, key: string) => (obj as Record<string, unknown>)?.[key], payload.data)
      )
      .join("");
    const toHash = concatenated + payload.timestamp + secret;
    const computed = crypto.createHash("sha256").update(toHash).digest("hex");
    if (computed !== payload.signature?.checksum) {
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }
  }

  const transaction = payload.data?.transaction;
  if (!transaction) return NextResponse.json({ received: true });

  const orderId = transaction.reference;
  const status = transaction.status; // APPROVED | DECLINED | VOIDED | ERROR

  if (status === "APPROVED") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAGADO", paymentRef: transaction.id },
    });
  } else if (status === "DECLINED") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELADO", paymentRef: transaction.id },
    });
    // Nota: si quieres devolver el stock automáticamente al rechazar un pago,
    // agrega aquí la lógica para incrementar Product.stock por cada OrderItem.
  }

  return NextResponse.json({ received: true });
}
