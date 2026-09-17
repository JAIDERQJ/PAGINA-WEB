import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cambios y devoluciones" };

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-3xl mb-8">Cambios y devoluciones</h1>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="font-display text-xl mb-2">Cambios</h2>
          <p className="text-muted">
            Tienes 30 días calendario desde que recibes tu pedido para solicitar un cambio de talla
            o color, siempre que la prenda conserve sus etiquetas originales y no haya sido usada.
            Escríbenos por WhatsApp o correo indicando tu número de pedido.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl mb-2">Devoluciones</h2>
          <p className="text-muted">
            Si el producto no cumple tus expectativas, puedes solicitar la devolución dentro de los
            primeros 5 días hábiles tras recibirlo. El reembolso se procesa por el mismo medio de
            pago en un plazo de hasta 15 días hábiles.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl mb-2">Tiempos de entrega</h2>
          <p className="text-muted">
            Ciudades principales: 3–5 días hábiles. Resto del país: 5–8 días hábiles. Te avisamos
            por correo cuando tu pedido sea despachado.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl mb-2">Condiciones de compra</h2>
          <p className="text-muted">
            Los precios incluyen IVA. El costo de envío se calcula en el checkout según tu ciudad.
            El pago se procesa de forma segura a través de Wompi; no almacenamos datos de tarjetas.
          </p>
        </section>
      </div>
    </div>
  );
}
