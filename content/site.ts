export const SITE = {
  name: "BeatSport",
  domain: "www.beatsport.fi",
  url: "https://www.beatsport.fi",
  locale: "fi_FI",
  titleTemplate: "%s | BeatSport",
  description:
    "BeatSport on valmentajille tehty web-sovellus valmennuksen seurantaan, palautteeseen ja muistiinpanoihin – kaikkiin urheilulajeihin.",
  social: {
    // lisää myöhemmin jos haluat (ei pakollinen)
    // instagram: "https://instagram.com/...",
  },
} as const;

export const ROUTES = {
  home: "/",
  product: "/web-app",
  coaches: "/valmentajille",
  education: "/koulutukset",
  demo: "/demo",
  login: "/login",
} as const;
