import Link from "next/link";
import { APP_NAV, type Mode, type NavItem } from "@/lib/nav";
import { NavIcon } from "@/components/icons/NavIcon";

function visible(item: NavItem, mode: Mode) {
  const v = item.showOn?.[mode];
  return v !== false;
}

export default function AppNav({ mode }: { mode: Mode }) {
  const items = APP_NAV.filter((i) => visible(i, mode));

  return (
    <>
      {items.map((item) => (
        <Link key={item.id} href={item.href} className="appNavLink">
          <NavIcon name={item.icon} />


          {mode !== "mobile" && (
            <span className="appNavLabel">{item.label}</span>
          )}
        </Link>
      ))}
    </>
  );
}
