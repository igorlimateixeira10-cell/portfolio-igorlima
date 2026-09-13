const LOCAL_SITE_URL = "http://localhost:3000";

/**
 * Produz uma URL canônica estável para metadata gerada no servidor.
 *
 * `NEXT_PUBLIC_SITE_URL` continua sendo a fonte de verdade para domínio
 * próprio. No deploy de produção da Vercel, o fallback usa a URL pública
 * disponibilizada pela plataforma em vez de publicar `localhost` por engano.
 */
export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProductionUrl =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ?? process.env.VERCEL_URL?.trim()
      : undefined;
  const value = configuredUrl || vercelProductionUrl || LOCAL_SITE_URL;
  const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  return new URL(normalized);
}
