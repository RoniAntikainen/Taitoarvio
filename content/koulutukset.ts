// content/koulutukset.ts

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type KoulutuksetContent = {
  seo: { title: string; description: string };

  hero: { kicker: string; h1: string; lead: string };

  levels: {
    kicker: string;
    title: string;
    lead: string;
    items: Array<{
      title: string;
      description: string;
      duration?: string;
    }>;
    notes: string[];
  };

  formats: {
    kicker: string;
    title: string;
    lead: string;
    items: Array<{ title: string; description: string; bullets: string[] }>;
  };

  testimonials: {
    kicker: string;
    title: string;
    lead: string;
    items: Testimonial[];
    link?: { label: string; href: string };
  };

  howToStart: {
    kicker: string;
    title: string;
    steps: Array<{ title: string; description: string }>;
  };

  links: {
    kicker: string;
    title: string;
    items: Array<{ label: string; href: string; note: string }>;
  };

  closing: { title: string; lead: string };
};

export const koulutuksetContent: KoulutuksetContent = {
  seo: {
    title: "BeatSport koulutukset – kolmen tason malli valmentajille ja lajiliitoille",
    description:
      "BeatSport-koulutus keskittyy rytmiikkaan ja kehontaitoelementteihin. Kolme tasoa, käytännön harjoitteet, materiaalit ja oheisvideot.",
  },

  hero: {
    kicker: "KOULUTUKSET",
    h1: "Koulutus, joka jättää teille toimivan mallin arkeen",
    lead:
      "Koulutuksissa yhdistyy käsitteet ja käytäntö: rytmiikka ja kehontaidot tehdään ymmärrettäväksi ja sovellettavaksi omaan lajiin.",
  },

  levels: {
    kicker: "RAKENNE",
    title: "Kolme tasoa (lajiliitoille / valmentajapolkuun)",
    lead:
      "Koulutukset voidaan toteuttaa kokonaisuutena tai rakentaa teille sopiva polku. Jokaisesta koulutuksesta jää käyttöön materiaali ja oheisvideot harjoitteista.",
    items: [
      {
        title: "Best of the Basics",
        description:
          "Avaa BeatSportin käsitteitä rytmiikasta ja kehontaitoelementeistä sekä antaa työkalut monipuolisen valmennuksen kehittämiseen.",
        duration: "4 × 45 min (luento + käytäntö)",
      },
      {
        title: "Practice Makes Perfect",
        description:
          "Syventävä kokonaisuus rytmiikan elementtien ymmärtämiseen ja harjoittamiseen sekä valmentajan oman soveltamisen kehittämiseen.",
        duration: "16 h ryhmässä + 4 h omaa opiskelua",
      },
      {
        title: "Master the Skill",
        description:
          "Keskittyy tarkkaan ja tarkoituksen mukaiseen taidon käyttöön yksilöllisesti.",
      },
    ],
    notes: [
      "Koulutuksissa on aina aikaa kysymyksille ja niiden läpikäymiselle.",
      "Kokonaisuus voidaan räätälöidä valmentajien koulutuspolkuun sopivaksi.",
    ],
  },

  formats: {
    kicker: "MUODOT",
    title: "Koulutusmuodot",
    lead: "Valitse teille sopiva tapa: yksilö, pienryhmä tai isompi ryhmä.",
    items: [
      {
        title: "Valmentajatyöpaja",
        description: "Yhteinen tapa opettaa ja havainnoida rytmiikkaa ja kehontaitoja.",
        bullets: ["1–2 h", "tiimille", "konkreettiset mallit + harjoitteet"],
      },
      {
        title: "Seurakoulutus",
        description: "Yhdenmukaistetaan linja ja sovitaan käytännöt seuran tasolla.",
        bullets: ["2–4 h", "valmennusjohto + valmentajat", "linja + käytännöt + roolit"],
      },
      {
        title: "Käyttöönoton tuki",
        description: "Kun malli on päätetty, tehdään se toimivaksi arjessa.",
        bullets: ["lyhyet checkit", "tuki kysymyksiin", "jatkuvuuden varmistus"],
      },
    ],
  },

  testimonials: {
    kicker: "PALAUTTEITA",
    title: "Kokemuksia käytännöstä",
    lead:
      "Suosittelut kertovat parhaiten, miltä muutos tuntuu liikkeessä ja valmennuksen arjessa.",
    items: [
      {
        quote:
          "Kehon valmiustila aktivoitui ja liikehallinta parani… dynaaminen liike ja suunnanvaihdot halliten.",
        author: "Anu Oksanen",
        role:
          "Helsingin Luistelijoiden muodostelmaluistelun päävalmentaja (Marigold IceUnity, Musketeers)",
      },
      {
        quote:
          "Liikkumisestani on tullut nopeampaa suunnanmuutoksissa… tunne liikkeen helppoudesta ja vapaudesta on ollut mahtavaa.",
        author: "Sebastian Dahlström",
        role: "Jalkapalloilija, KuPS",
      },
      {
        quote:
          "Oikeanlainen kehon kannattelu auttoi tempojen vaihtoa ja ajoituksia… dynamiikan vapauttamista oikeaan aikaan.",
        author: "Jaak Vainomaa & Tiina Tulikallio",
        role: "Tanssiurheilu, ammattilaisten 10-tanssin MM",
      },
    ],
    link: { label: "Katso kaikki referenssit", href: "/referenssit" },
  },

  howToStart: {
    kicker: "NÄIN ALOITETAAN",
    title: "Lyhyt eteneminen",
    steps: [
      { title: "Tavoite", description: "Mitä halutaan parantaa arjessa seuraavaksi?" },
      { title: "Sisältö", description: "Valitaan taso / teemat ja sovitaan rakenne." },
      { title: "Käyttö", description: "Viedään malli arkeen ja varmistetaan jatkuvuus." },
    ],
  },

  links: {
    kicker: "LINKIT",
    title: "Lisätietoa",
    items: [
      { label: "Valmentajille", href: "/valmentajille", note: "Miten malli näkyy valmentajan arjessa." },
      { label: "Referenssit", href: "/referenssit", note: "Kokemuksia eri lajeista." },
      { label: "Ota yhteyttä", href: "/ota-yhteytta", note: "Kysy koulutuksesta tai sisällöstä." },
    ],
  },

  closing: {
    title: "Kun malli on selkeä, tekeminen kevenee",
    lead:
      "Koulutuksen ydin on jatkuvuus: sama tapa toimia auttaa valmentajia, urheilijoita ja seuran arkea.",
  },
};
