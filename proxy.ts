import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "@/lib/i18n";

// Redireciona a raiz do site para o idioma padrão (pt).
// Simples de propósito: o site tem só duas rotas reais, /pt e /en.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
}

export const config = {
  matcher: "/",
};
