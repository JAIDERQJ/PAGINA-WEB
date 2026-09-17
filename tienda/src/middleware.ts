import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protección simple de /admin: exige una cookie "admin_session" con el valor
// correcto (comparado contra ADMIN_PASSWORD). No es un sistema de usuarios,
// es intencionalmente mínimo para un solo administrador.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const session = req.cookies.get("admin_session")?.value;
    if (session !== process.env.ADMIN_PASSWORD) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
