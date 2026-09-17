import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/format";
import { notFound } from "next/navigation";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-3">¡Pedido recibido!</h1>
      <p className="text-muted mb-8">
        Pedido #{order.id.slice(-8).toUpperCase()} — te contactaremos a {order.customerEmail} para
        confirmar el envío.
      </p>

      <div className="border border-line text-left p-6 space-y-2 text-sm mb-8">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name} × {item.quantity}</span>
            <span>{formatCOP(item.unitPrice.toString())}</span>
          </div>
        ))}
        <div className="border-t border-line pt-2 flex justify-between">
          <span>Total</span>
          <span>{formatCOP(order.total.toString())}</span>
        </div>
      </div>

      <Link href="/catalogo" className="underline text-sm">Seguir comprando</Link>
    </div>
  );
}
