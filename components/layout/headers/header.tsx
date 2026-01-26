"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import {
  HeaderNavLinks as navLinks,
  HeaderActionLinks as actionLinks,
} from "@/lib/header";
import Button from "@/components/buttons/button";

/**
 * Header + mobile drawer, a11y-first:
 * - Skip link
 * - aria-current
 * - ESC closes
 * - Scroll lock + scrollbar compensation
 * - Focus trap in dialog
 * - Focus restore to toggle
 * - Click overlay to close
 * - Optional inert/aria-hidden to background via #app-shell OR #main-content
 *
 * IMPORTANT:
 * For inert/aria-hidden to be correct, the element you target MUST NOT include this Header.
 * Recommended layout:
 *   <Header />
 *   <div id="app-shell">
 *     <main id="main-content">...</main>
 *   </div>
 */

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
    if (el.offsetParent === null) return false; // display:none or hidden in layout
    return true;
  });
}

function setInert(el: HTMLElement, inert: boolean) {
  // TS libdom may not have inert everywhere
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (el as any).inert = inert;
}

export default function Header() {
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

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Inert + aria-hidden for background (must NOT include header)
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Prefer main-content, fallback app-shell
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

  // Open/close side effects: ESC, scroll lock, focus restore
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

      // Restore focus to toggle
      toggleBtnRef.current?.focus();
    };
  }, [menuOpen, closeMenu]);

  // Focus trap inside panel + focus first on open
  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    // Focus first focusable; fallback panel
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
        // Shift+Tab: if focus outside panel or at first -> wrap to last
        if (!inPanel || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if focus outside panel or at last -> wrap to first
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
      {/* Skip link */}
      <a className="skipLink" href="#main-content">
        Siirry sisältöön
      </a>

      <header className="site-header" data-menu-open={menuOpen ? "true" : "false"}>
        <div className="site-header__inner">
          <div className="site-header__logo">
            <Link href="/" aria-label="BeatSport etusivulle">
              {/* Prefer span to avoid extra headings in layout; style via CSS */}
              <span className="site-header__brand">BeatSport</span>
            </Link>
          </div>

          {/* Desktop nav */}
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

          {/* Actions + mobile toggle */}
          <div className="site-header__actions">
            <div className="site-header__actionLinks">
              {actionLinks.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className={cx(
                    "header__action-item",
                    "button",
                    action.className
                  )}
                >
                  {action.label}
                </Link>
              ))}
            </div>

            <Button
              ref={toggleBtnRef}
              className="site-header__menuToggle"
              variant="ghost"
              aria-expanded={menuOpen}
              aria-controls={panelId}
              aria-label={menuOpen ? "Sulje valikko" : "Avaa valikko"}
              onClick={toggleMenu}
              type="button"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>

        {/* Overlay (presentation-only). CSS should set pointer-events:none when closed. */}
        <div
          className={cx("mobileMenuOverlay", menuOpen && "is-open")}
          onClick={closeMenu}
          aria-hidden="true"
          role="presentation"
        />

        {/* Drawer */}
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

            <Button
              variant="ghost"
              className="mobileMenuClose"
              aria-label="Sulje valikko"
              onClick={closeMenu}
              type="button"
            >
              <X size={22} />
            </Button>
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
            {actionLinks.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className={cx("header__action-item", "button", action.className)}
                onClick={closeMenu}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </aside>
      </header>
    </>
  );
}
