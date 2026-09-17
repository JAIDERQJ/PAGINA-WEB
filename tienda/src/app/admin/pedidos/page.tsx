import { prisma } from "@/lib/prisma";
import { formatCOP } from "@/lib/format";
import OrderStatusSelect from "./OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-muted text-sm">Aún no has recibido pedidos.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border-2 border-ink p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <p className="font-display">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-muted">
                    {order.createdAt.toLocaleDateString("es-CO", { dateStyle: "medium" })}
                  </p>
                </div>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted text-xs uppercase mb-1">Cliente</p>
                  <p>{order.customerName}</p>
                  <p className="text-muted">{order.customerEmail} · {order.customerPhone}</p>
                  <p className="text-muted">{order.address}, {order.city}, {order.department}</p>
                  {order.notes && <p className="text-muted italic mt-1">Nota: {order.notes}</p>}
                </div>
                <div>
                  <p className="text-muted text-xs uppercase mb-1">Productos</p>
                  {order.items.map((item) => (
                    <p key={item.id}>
                      {item.name} {[item.color, item.size].filter(Boolean).length > 0 && `(${[item.color, item.size].filter(Boolean).join(" / ")})`} × {item.quantity}
                    </p>
                  ))}
                  <p className="mt-2 font-display">{formatCOP(order.total.toString())}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
