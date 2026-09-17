import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-3xl mb-6">Contacto</h1>
      <p className="text-muted mb-8">
        ¿Tienes una pregunta sobre un pedido, una talla o un cambio? Escríbenos por el medio que
        prefieras y te respondemos lo antes posible.
      </p>
      <div className="space-y-4 text-sm">
        <div className="border border-line p-5">
          <p className="text-muted mb-1">WhatsApp</p>
          <a href="https://wa.me/573000000000" target="_blank" className="hover:underline">
            +57 300 000 0000
          </a>
        </div>
        <div className="border border-line p-5">
          <p className="text-muted mb-1">Correo</p>
          <a href="mailto:hola@terreno.co" className="hover:underline">hola@terreno.co</a>
        </div>
        <div className="border border-line p-5">
          <p className="text-muted mb-1">Ubicación</p>
          <p>Bogotá, Colombia — envíos a todo el país</p>
        </div>
      </div>
    </div>
  );
}
