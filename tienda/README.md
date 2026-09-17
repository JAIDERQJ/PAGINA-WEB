# Terreno — Tienda online (proyecto para emprendimiento)

Tienda simple hecha con **Next.js + TypeScript + Tailwind + Prisma + PostgreSQL**.
Diseñada para que un solo dueño de negocio la administre sin ayuda técnica, con
costos bajos para empezar y espacio para crecer.

## Qué incluye

- Página principal, catálogo (con filtro por categoría), ficha de producto con
  tallas/colores/fotos, carrito persistente y checkout.
- Pago real con **Wompi** (widget oficial), sin comisiones fijas mensuales.
- Panel `/admin` protegido con una contraseña: crear/editar/eliminar productos,
  actualizar precio y stock, ver pedidos y cambiar su estado.
- SEO básico: metadata, Open Graph, sitemap.xml y robots.txt automáticos.
- Página de contacto y de políticas de cambios/devoluciones.

## 1. Instalación local

```bash
npm install
cp .env.example .env
```

Completa `.env` con tus propios valores (ver secciones siguientes) y luego:

```bash
npx prisma migrate dev --name init   # crea las tablas en tu base de datos
npx prisma db seed                    # carga 5 productos de ejemplo
npm run dev                           # abre http://localhost:3000
```

Panel de administración: `http://localhost:3000/admin` con la contraseña que
pusiste en `ADMIN_PASSWORD`.

## 2. Base de datos gratuita (Neon)

1. Crea una cuenta en **https://neon.tech** (plan gratuito permanente, no expira).
2. Crea un proyecto nuevo → copia el "Connection string".
3. Pégalo en `DATABASE_URL` dentro de tu `.env` (y luego en Vercel, ver paso 5).

Alternativa igual de válida: **Supabase** (también tiene Postgres gratis).

## 3. Pagos con Wompi

Wompi es la pasarela más simple para Colombia: sin mensualidad, cobra un
porcentaje solo cuando vendes.

1. Crea una cuenta de comercio en **https://comercios.wompi.co**.
2. Ve a **Desarrolladores → Llaves API**. Ahí encuentras:
   - **Llave pública** → `WOMPI_PUBLIC_KEY`
   - **Secreto de integridad** → `WOMPI_INTEGRITY_SECRET`
   - **Secreto de eventos** (para el webhook) → `WOMPI_EVENTS_SECRET`
3. Mientras pruebas, usa las llaves de **sandbox** (empiezan con `pub_test_`).
   Cuando tu cuenta esté aprobada por Wompi, cambia a las llaves de producción
   (`pub_prod_`) en Vercel.
4. En el panel de Wompi, configura la **URL de eventos (webhook)** apuntando a:
   `https://tudominio.com/api/webhooks/wompi`
   Esto hace que un pedido pase automáticamente a "Pagado" cuando el cliente
   completa el pago.

No necesitas escribir código adicional: el checkout ya está integrado.

## 4. Imágenes de producto

El proyecto no incluye almacenamiento de imágenes propio (para mantener el
costo en $0). Recomendado:

- **Cloudinary** (plan gratuito: 25GB) → sube tu foto, copia la URL pública,
  pégala en el campo "Imágenes" del admin al crear el producto.
- O **Vercel Blob** si prefieres mantener todo dentro de Vercel.

## 5. Desplegar en Vercel (gratis)

1. Sube este proyecto a un repositorio de GitHub.
2. Entra a **https://vercel.com** → "Add New Project" → importa el repositorio.
3. En "Environment Variables" pega las mismas variables de tu `.env`:
   `DATABASE_URL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL` (usa tu dominio
   final aquí), `WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET`, `WOMPI_EVENTS_SECRET`.
4. Despliega. Vercel te da una URL tipo `tienda.vercel.app` que ya funciona
   con HTTPS automático.
5. Ejecuta las migraciones contra tu base de producción una vez:
   ```bash
   DATABASE_URL="tu-url-de-neon" npx prisma migrate deploy
   DATABASE_URL="tu-url-de-neon" npx prisma db seed   # opcional
   ```

## 6. Comprar y conectar tu dominio propio

1. Compra el dominio en **Namecheap**, **GoDaddy** o **Google Domains** (~US$10–15/año).
2. En Vercel: **Project → Settings → Domains** → escribe tu dominio
   (ej. `www.mitienda.com`) → Vercel te muestra los registros DNS exactos.
3. En el panel de tu proveedor de dominio, ve a la sección DNS y agrega esos
   registros (normalmente un `CNAME` para `www` y un `A` para el dominio raíz).
4. Espera 10 minutos a unas horas (propagación DNS). Vercel activa HTTPS
   automáticamente con Let's Encrypt, sin que hagas nada más.
5. Actualiza `NEXT_PUBLIC_SITE_URL` en Vercel con tu dominio final y vuelve a
   desplegar.

## 7. Actualizaciones futuras

Cada vez que hagas `git push` a tu repositorio, Vercel vuelve a desplegar
automáticamente. Para agregar productos, cambiar precios o ver pedidos del
día a día, no necesitas tocar código: todo se hace desde `/admin`.

---

## Costos de mantenimiento

### Obligatorios
| Servicio | Costo |
|---|---|
| Dominio | ~US$10–15/año |
| Comisión de Wompi por venta | Variable (~2.65% + IVA por transacción con tarjeta; confirma las tarifas vigentes en wompi.co) |

### Con plan gratuito mientras el negocio es pequeño
| Servicio | Costo | Cuándo empieza a costar |
|---|---|---|
| Hosting (Vercel) | $0 | Si tienes mucho tráfico (poco probable al inicio) |
| Base de datos (Neon) | $0 | Si superas el almacenamiento/cómputo del plan gratuito |
| Imágenes (Cloudinary) | $0 | Si superas 25GB de almacenamiento/transferencia |

### Opcionales (agrégalos solo si el negocio crece)
- Correo transaccional para notificar pedidos (Resend, ~$0–20/mes).
- Google Analytics / Meta Pixel (gratis, solo requiere agregar el script).
- Plan pago de Vercel si el tráfico crece mucho ($20/mes).

**Resumen: puedes operar por menos de US$15 al año mientras el negocio es
pequeño**, y solo subes de plan cuando el volumen de ventas lo justifique.

---

## Estructura del proyecto

```
prisma/schema.prisma       Modelo de datos (Product, Order, OrderItem)
prisma/seed.ts              Productos de ejemplo
src/app/                    Páginas (home, catálogo, producto, carrito, checkout...)
src/app/admin/              Panel de administración
src/app/api/                Rutas de API (checkout, webhook de Wompi, admin)
src/components/             Componentes de UI reutilizables
src/lib/                     Prisma client, formato de moneda, carrito, firma Wompi
```

## Siguientes pasos sugeridos (cuando el negocio crezca)

- Agregar más categorías simplemente escribiéndolas al crear un producto
  (el campo "categoría" es texto libre, no requiere migrar la base de datos).
- Si necesitas inventario por talla/color de forma independiente (no solo un
  stock general por producto), se puede extender el modelo a variantes.
- Si quieres que los clientes tengan cuenta y vean su historial de pedidos,
  se puede agregar autenticación más adelante sin rehacer el proyecto.
