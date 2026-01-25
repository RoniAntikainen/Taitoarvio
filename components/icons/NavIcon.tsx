import { Home, Library, Bell, BarChart3 } from "lucide-react";
import type { IconName } from "@/lib/nav";

const ICONS = {
  home: Home,
  library: Library,
  bell: Bell,
  chart: BarChart3,
};

export function NavIcon({ name }: { name: IconName }) {
  const Icon = ICONS[name];
  return <Icon size={22} strokeWidth={1.8} />;
}
