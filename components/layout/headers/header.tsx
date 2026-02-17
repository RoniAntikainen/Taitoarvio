"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";

import { HeaderNavLinks as navLinks } from "@/lib/header";

type EntitlementStatus = string; // voit halutessa tarkentaa unioniksi myöhemmin

type Props = {
  signedIn?: boolean;
  hasPro?: boolean;      // "ostettu / tilattu"
  status?: EntitlementStatus; // ✅ lisätty -> TS-virhe pois
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

function getFocusable(container: HTMLElement) {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  const nodes = Array.from(container.querySelectorAll<HTMLElement>(selector));
  return nodes.filter((el) => {
    if (el.hasAttribute("disabled")) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    if (el.offsetParent === null) return false;
    return true;
  });
}

function setInert(el: HTMLElement, inert: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (el as any).inert = inert;
}

export default function Header({ signedIn = false, hasPro = false }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const panelId = useId();
  const titleId = useId();

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  const nav = useMemo(
    () =>
      navLinks.map((l) => ({
        ...l,
        current: isActive(pathname, l.href),
      })),
    [pathname]
  );

  const loginHref = useMemo(() => {
    const cb = encodeURIComponent(pathname || "/");
    return `/api/auth/signin?callbackUrl=${cb}`;
  }, [pathname]);

  // ✅ SUN HALUAMA LOGIIKKA
  // 1) ei kirjautunut -> Aloita kokeilu + Kirjaudu sisään
  // 2) kirjautunut + ei ostettu -> Aloita kokeilu + Kirjaudu ulos
  // 3) kirjautunut + ostettu -> Avaa app + Kirjaudu ulos
  const actions = useMemo(() => {
    if (!signedIn) {
      return {
        primary: { href: "/pricing", label: "Aloita kokeilu", className: "button--primary" },
        secondary: { href: loginHref, label: "Kirjaudu sisään", className: "button--ghost" },
        showSignOut: false,
      } as const;
    }

    if (hasPro) {
      return {
        primary: { href: "/app", label: "Avaa app", className: "button--primary" },
        secondary: null,
        showSignOut: true,
      } as const;
    }

    return {
      primary: { href: "/pricing", label: "Aloita kokeilu", className: "button--primary" },
      secondary: null,
      showSignOut: true,
    } as const;
  }, [signedIn, hasPro, loginHref]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const bg =
      document.getElementById("main-content") ??
      document.getElementById("app-shell");

    if (!bg) return;

    if (menuOpen) {
      bg.setAttribute("aria-hidden", "true");
      setInert(bg, true);
    } else {
      bg.removeAttribute("aria-hidden");
      setInert(bg, false);
    }

    return () => {
      bg.removeAttribute("aria-hidden");
      setInert(bg, false);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.documentElement.style.overflow;
    const prevPaddingRight = document.documentElement.style.paddingRight;

    const sw = getScrollbarWidth();
    document.documentElement.style.overflow = "hidden";
    if (sw > 0) document.documentElement.style.paddingRight = `${sw}px`;

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = prevOverflow;
      document.documentElement.style.paddingRight = prevPaddingRight;

      toggleBtnRef.current?.focus();
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const items = getFocusable(panel);
    (items[0] ?? panel).focus?.();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusables = getFocusable(panel);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      const inPanel = !!active && panel.contains(active);

      if (e.shiftKey) {
        if (!inPanel || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!inPanel || active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <a className="skipLink" href="#main-content">
        Siirry sisältöön
      </a>

      <header className="site-header" data-menu-open={menuOpen ? "true" : "false"}>
        <div className="site-header__inner">
          <div className="site-header__logo">
            <Link href="/" aria-label="BeatSport etusivulle">
              <span className="site-header__brand">BeatSport</span>
            </Link>
          </div>

          <nav className="site-header__nav" aria-label="Päänavigaatio">
            <ul className="site-header__navList">
              {nav.map((link) => (
                <li key={link.id} className="site-header__navItem">
                  <Link
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    className="site-header__navLink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <div className="site-header__actionLinks">
              {/* secondary: vain ei-kirjautuneena */}
              {actions.secondary && (
                <Link
                  href={actions.secondary.href}
                  className={cx("header__action-item", "button", actions.secondary.className)}
                >
                  {actions.secondary.label}
                </Link>
              )}

              {/* primary: aina */}
              <Link
                href={actions.primary.href}
                className={cx("header__action-item", "button", actions.primary.className)}
              >
                {actions.primary.label}
              </Link>

              {/* signout: vain kirjautuneena */}
              {actions.showSignOut && (
                <button
                  type="button"
                  className={cx("header__action-item", "button", "button--outline")}
                  onClick={() => signOut({ callbackUrl: pathname || "/" })}
                >
                  Kirjaudu ulos
                </button>
              )}
            </div>

            <button
              ref={toggleBtnRef}
              type="button"
              className="site-header__menuToggle"
              aria-expanded={menuOpen}
              aria-controls={panelId}
              aria-label={menuOpen ? "Sulje valikko" : "Avaa valikko"}
              onClick={toggleMenu}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div
          className={cx("mobileMenuOverlay", menuOpen && "is-open")}
          onClick={closeMenu}
          aria-hidden="true"
          role="presentation"
        />

        <aside
          ref={panelRef}
          id={panelId}
          className={cx("mobileMenuPanel", menuOpen && "is-open")}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          <div className="mobileMenuHeader">
            <div id={titleId} className="mobileMenuBrand">
              BeatSport
            </div>

            <button type="button" className="mobileMenuClose" aria-label="Sulje valikko" onClick={closeMenu}>
              <X size={22} />
            </button>
          </div>

          <nav className="mobileMenuNav" aria-label="Mobiilinavigaatio">
            <ul className="mobileMenuList">
              {nav.map((link) => (
                <li key={link.id} className="mobileMenuItem">
                  <Link
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                    onClick={closeMenu}
                    className="mobileMenuLink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobileMenuActions">
            {actions.secondary && (
              <Link
                href={actions.secondary.href}
                className={cx("header__action-item", "button", actions.secondary.className)}
                onClick={closeMenu}
              >
                {actions.secondary.label}
              </Link>
            )}

            <Link
              href={actions.primary.href}
              className={cx("header__action-item", "button", actions.primary.className)}
              onClick={closeMenu}
            >
              {actions.primary.label}
            </Link>

            {actions.showSignOut && (
              <button
                type="button"
                className={cx("header__action-item", "button", "button--outline")}
                onClick={() => {
                  closeMenu();
                  signOut({ callbackUrl: pathname || "/" });
                }}
              >
                Kirjaudu ulos
              </button>
            )}
          </div>
        </aside>
      </header>
    </>
  );
}
