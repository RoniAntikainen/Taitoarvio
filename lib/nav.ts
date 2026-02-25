export type Mode = "mobile" | "tablet" | "desktop";

export type IconName =
  | "home"
  | "library"
  | "bell"
  | "chart"
  | "users"
  | "calendar"
  | "settings"
  | "shield"
  | "file"
  | "clipboard"
  | "star"
  | "search"
  | "plus"
  | "activity"
  | "database"
  | "help";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  showOn?: Partial<Record<Mode, boolean>>;
};

export const APP_NAV: NavItem[] = [
  {
    id: "home",
    label: "Koti",
    href: "/app",
    icon: "home",
  },
  {
    id: "folders",
    label: "Ryhmäkansiot",
    href: "/app/folders",
    icon: "library",
  },
  {
    id: "calendar",
    label: "Kalenteri",
    href: "/app/calendar",
    icon: "calendar",
    showOn: { mobile: false, tablet: true, desktop: true },
  },
  {
    id: "notifications",
    label: "Ilmoitukset",
    href: "/app/notifications",
    icon: "bell",
    showOn: { mobile: false, tablet: true, desktop: true },
  },
  {
    id: "settings",
    label: "Asetukset",
    href: "/app/settings",
    icon: "settings",
  },
];
