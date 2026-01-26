// src/lib/header.ts
// Pro-level, stable routes + typed nav config (data-driven)

export const ROUTES = {
  home: "/" as const,

  // Marketing pages (beatsport.fi)
  product: "/web-app" as const,
  coaches: "/valmentajille" as const,
  education: "/koulutukset" as const,
  demo: "/demo" as const,

  // Auth entry (redirects to the actual app after login)
  login: "/login" as const,
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export type NavLink = Readonly<{
  id: "home" | "product" | "coaches" | "education";
  href: RoutePath;
  label: string;
}>;

export type ActionLink = Readonly<{
  id: "demo" | "login";
  href: RoutePath;
  label: string;
  className?: string;
}>;

/**
 * Header primary navigation (marketing site).
 * Keep this stable; product features belong inside /web-app, not top-level nav.
 */
export const HeaderNavLinks: readonly NavLink[] = [
  { id: "home", href: ROUTES.home, label: "Etusivu" },
  { id: "product", href: ROUTES.product, label: "Web App" },
  { id: "coaches", href: ROUTES.coaches, label: "Valmentajille" },
  { id: "education", href: ROUTES.education, label: "Koulutukset" },
] as const;

/**
 * Header CTAs (marketing site).
 * /login should handle auth and then redirect to the real app.
 */
export const HeaderActionLinks: readonly ActionLink[] = [
  {
    id: "demo",
    href: ROUTES.demo,
    label: "Pyydä demo",
    className: "button--primary",
  },
  {
    id: "login",
    href: ROUTES.login,
    label: "Kirjaudu",
    className: "button--ghost",
  },
] as const;

/**
 * Optional: App origin (if app is on a different subdomain).
 * Use this inside /login redirect logic, not in the header nav.
 *
 * Example:
 *  NEXT_PUBLIC_APP_ORIGIN="https://app.beatsport.fi"
 */
export const APP_ORIGIN =
  (process.env.NEXT_PUBLIC_APP_ORIGIN as string | undefined) ?? "";

/**
 * Helper: build absolute app URLs safely.
 * If APP_ORIGIN is empty, returns path (useful when app lives under same origin).
 */
export function appUrl(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  return APP_ORIGIN ? `${APP_ORIGIN}${path}` : path;
}
