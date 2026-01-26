import type { Metadata } from "next";
import ScrollyExperience from "@/components/scrolly/ScrollyExperience";

export const metadata: Metadata = {
  title: "BeatSport — Valmennus yhdessä näkymässä",
  description:
    "Uppouttava valmennuskokemus: seuranta, palaute ja muistiot yhdessä paikassa. Kaikki lajit.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "BeatSport",
    description:
      "Uppouttava valmennuskokemus: seuranta, palaute ja muistiot yhdessä paikassa.",
    url: "https://www.beatsport.fi/",
    siteName: "BeatSport",
  },
};

export default function Page() {
  return (
    <main id="main-content">
      <ScrollyExperience />
    </main>
  );
}
