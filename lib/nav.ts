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
  // =========================
  // CORE (kaikissa)
  // =========================
  {
    id: "home",
    label: "Koti",
    href: "/app",
    icon: "home",
  },
  {
    id: "folders",
    label: "Kirjasto",
    href: "/app/folders",
    icon: "library",
  },

  // =========================
  // WORK (tablet + desktop)
  // =========================

  {
    id: "calendar",
    label: "Kalenteri",
    href: "/app/calendar",
    icon: "calendar",
    showOn: { mobile: false, tablet: true, desktop: true },
  },
  
  {
    id: "settings",
    label: "Settings",
    href: "/app/settings",
    icon: "settings",
    showOn: { mobile: false, tablet: true, desktop: true },
  },

];
