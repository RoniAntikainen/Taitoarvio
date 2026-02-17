"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import shared from "@/app/(marketing)/_styles/marketingPage.module.css";

export type SideSection = { id: string; label: string };

export type SideCta = {
  href: string;
  label: string;
  variant: "primary" | "ghost";
};

export function KoulutuksetSideNav({
  title,
  sections,
  ctas,
  navLabel = "Sivun navigaatio",
}: {
  title: string;
  sections: readonly SideSection[];
  ctas: readonly SideCta[];
  navLabel?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(section.id);
          }
        },
        {
          rootMargin: "-40% 0px -55% 0px", 
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [sections]);

  return (
    <aside className={shared.sidebarCol} aria-label={navLabel}>
      <div className={shared.sideNavInner}>
        <div>
          <div className={shared.sideTitle}>{title}</div>

          <nav className={shared.sideBody} aria-label="Sisällys">
            <ul className={shared.sideList}>
              {sections.map((s) => {
                const isActive = activeId === s.id;

                return (
                  <li key={s.id} className={shared.sideListItem}>
                    <a
                      href={`#${s.id}`}
                      className={`${shared.sideLink} ${
                        isActive ? shared.sideLinkActive : ""
                      }`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className={shared.sideCtas}>
          {ctas.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className={`button button--${cta.variant}`}
            >
              {cta.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
