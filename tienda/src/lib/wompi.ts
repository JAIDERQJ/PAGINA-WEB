import crypto from "crypto";

// Wompi Web Checkout requiere una "firma de integridad" para evitar que alguien
// manipule el monto desde el navegador. Se calcula así (doc oficial):
// https://docs.wompi.co/docs/en/widget-checkout-web#firma-de-integridad
// SHA256( referencia + monto_en_centavos + moneda + secreto_integridad )
export function buildWompiSignature({
  reference,
  amountInCents,
  currency = "COP",
}: {
  reference: string;
  amountInCents: number;
  currency?: string;
}) {
  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secret) {
    throw new Error("Falta configurar WOMPI_INTEGRITY_SECRET en las variables de entorno.");
  }
  const raw = `${reference}${amountInCents}${currency}${secret}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}
