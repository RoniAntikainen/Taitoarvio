import {
  Home,
  Library,
  Bell,
  BarChart3,
  Users,
  Calendar,
  Settings,
  Shield,
  FileText,
  ClipboardList,
  Star,
  Search,
  Plus,
  Activity,
  Database,
  HelpCircle,
} from "lucide-react";

import type { IconName } from "@/lib/nav"; // tai mistä IconName tulee

const ICONS: Record<IconName, React.ComponentType<any>> = {
  home: Home,
  library: Library,
  bell: Bell,
  chart: BarChart3,
  users: Users,
  calendar: Calendar,
  settings: Settings,
  shield: Shield,
  file: FileText,
  clipboard: ClipboardList,
  star: Star,
  search: Search,
  plus: Plus,
  activity: Activity,
  database: Database,
  help: HelpCircle,
};

type Props = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className,
}: Props) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;

  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  );
}
