export type Mode = "mobile" | "tablet" | "desktop";

export type IconName = "home" | "library" | "bell" | "chart";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  showOn?: Partial<Record<Mode, boolean>>;
};

export const APP_NAV: NavItem[] = [
  { id: "home", label: "Koti", href: "/app", icon: "home" },

  {
    id: "folders",
    label: "Kirjasto",
    href: "/app/folders",
    icon: "library",
  },

  {
    id: "notifications",
    label: "Ilmoitukset",
    href: "/app/notifications",
    icon: "bell",
  },

  {
    id: "reports",
    label: "Raportit",
    href: "/app/reports",
    icon: "chart",
    showOn: { mobile: false, tablet: true, desktop: true },
  },
];
