import Link from "next/link";
import Icon from "@/components/icon/Icon";
import { APP_NAV } from "@/lib/nav";

export default function AppNav({ mode }: { mode: "mobile" | "tablet" | "desktop" }) {
  return (
    <>
      {APP_NAV
        .filter(item => item.showOn?.[mode] !== false)
        .map(item => (
          <Link
            key={item.id}
            href={item.href}
            aria-current={false /* korvaa oikealla checkillä */}
          >
            <Icon name={item.icon} />
            <span className="navLabel">{item.label}</span>
          </Link>
        ))}
    </>
  );
}
