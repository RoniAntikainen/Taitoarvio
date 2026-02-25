"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/icon/Icon";
import { APP_NAV } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppNav({ mode }: { mode: "mobile" | "tablet" | "desktop" }) {
  const pathname = usePathname();

  return (
    <>
      {APP_NAV
        .filter((item) => item.showOn?.[mode] !== false)
        .map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link key={item.id} href={item.href} aria-current={active ? "page" : undefined}>
              <Icon name={item.icon} />
              <span className="navLabel">{item.label}</span>
            </Link>
          );
        })}
    </>
  );
}
