export type ScaleId = "official" | "oneToFive" | "stars";

export type Criterion = {
  id: string;
  label: string;
  description?: string;
};

export type SportConfig = {
  id: string;
  label: string;
  officialScale: ScaleId;
  criteria: Criterion[];
  // tanssille (tai muulle) alaryhmät:
  subItems?: { id: string; label: string; criteria?: Criterion[] }[];
};

export const SPORT_CONFIG: SportConfig[] = [
  {
    id: "football",
    label: "Jalkapallo",
    officialScale: "oneToFive",
    criteria: [
      { id: "technique", label: "Tekniikka" },
      { id: "speed", label: "Nopeus" },
      { id: "decision", label: "Päätöksenteko" },
      { id: "teamplay", label: "Joukkuepelaaminen" },
    ],
  },
  {
    id: "dance",
    label: "Tanssi",
    officialScale: "oneToFive",
    subItems: [
      { id: "waltz", label: "Valssi" },
      { id: "tango", label: "Tango" },
      { id: "cha-cha", label: "Cha cha" },
    ],
    criteria: [
      { id: "timing", label: "Rytmi / Timing" },
      { id: "technique", label: "Tekniikka" },
      { id: "balance", label: "Tasapaino" },
      { id: "performance", label: "Ilmaisu / Presentaatio" },
    ],
  },
];

export function getSport(id: string) {
  return SPORT_CONFIG.find(s => s.id === id) ?? SPORT_CONFIG[0];
}
