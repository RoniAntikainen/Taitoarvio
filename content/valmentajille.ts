// content/valmentajille.ts

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type ValmentajilleContent = {
  seo: { title: string; description: string };

  hero: { kicker: string; h1: string; lead: string };

  corePoints: Array<{ title: string; description: string }>;

  method: {
    kicker: string;
    title: string;
    lead: string;
    bullets: string[];
  };

  webApp: {
    kicker: string;
    title: string;
    lead: string;
    bullets: string[];
    link: { label: string; href: string };
  };

  testimonials: {
    kicker: string;
    title: string;
    lead: string;
    items: Testimonial[];
    link?: { label: string; href: string };
  };

  howItFits: {
    kicker: string;
    title: string;
    items: Array<{ title: string; description: string }>;
  };

  closing: { title: string; lead: string };
};

export const valmentajilleContent: ValmentajilleContent = {
  seo: {
    title: "BeatSport valmentajille – rytmiikka, kehontaidot ja jatkuvuus",
    description:
      "BeatSport tukee valmentajan arkea: rytmiikan ja kehontaitojen kehittäminen, selkeä dokumentointi ja jatkuvuus yhdessä näkymässä.",
  },

  hero: {
    kicker: "VALMENTAJILLE",
    h1: "Selkeä tapa kehittää rytmiikkaa ja kehontaitoja lajissa kuin lajissa",
    lead:
      "Rakennetaan yhteinen malli, joka toimii arjessa: havainnot, harjoitteet ja palaute pysyvät kasassa — ja kehitys näkyy ajassa.",
  },

  corePoints: [
    {
      title: "Yhteinen kieli",
      description:
        "Kun käsitteet ja tavoitteet on sovittu, tiimin on helppo valmentaa samaan suuntaan.",
    },
    {
      title: "Arkeen sopiva rakenne",
      description:
        "Kevyt malli: kirjaaminen on nopeaa, mutta tieto pysyy löydettävänä myöhemmin.",
    },
    {
      title: "Päätöksenteko helpottuu",
      description:
        "Valmennus ei perustu pelkkään fiilikseen, vaan siihen mitä on oikeasti tehty ja havaittu.",
    },
  ],

  method: {
    kicker: "MENETELMÄ",
    title: "Rytmiikka + kehontaidot käytännön kautta",
    lead:
      "BeatSportin ydin on kehollinen oivaltaminen. Harjoitteet ovat helppoja tehdä, mutta niiden soveltaminen omaan lajiin kehittää valmentajan näkemystä ja työkalupakkia.",
    bullets: [
      "Rytmiikan kehittäminen kehontaitoelementtien kautta",
      "Harjoitteet sovellettavissa omaan lajiin ja valmennusympäristöön",
      "Käytännön harjoitteet + käsitteet → helpompi opettaa ja mitata",
    ],
  },

  webApp: {
    kicker: "WEB APP",
    title: "BeatSport on web app valmentajille",
    lead:
      "Selaimessa toimiva web app tukee valmennuksen jatkuvuutta: kirjaukset, havainnot ja palaute yhdessä paikassa — ilman raskasta järjestelmää.",
    bullets: [
      "Toimii selaimessa – ei asennuksia",
      "Sopii yksilö- ja ryhmävalmennukseen",
      "Rakenteinen tapa dokumentoida valmennusta",
    ],
    link: { label: "Tutustu Web Appiin", href: "/web-app" },
  },

  testimonials: {
    kicker: "KOKEMUKSIA",
    title: "Urheilijoiden ja valmentajien kokemuksia",
    lead:
      "Tässä aitoja nostoja siitä, miten harjoitteet ovat näkyneet liikkeessä, rytmiikassa ja suorituskyvyssä.",
    items: [
      {
        quote:
          "Kehon valmiustila aktivoitui ja liikehallinta parani… musiikin ja liikkeen yhdistämistä hiottiin ja karaktäärien esittämistä voimistettiin.",
        author: "Anu Oksanen",
        role:
          "Helsingin Luistelijoiden muodostelmaluistelun päävalmentaja (Marigold IceUnity, Musketeers)",
      },
      {
        quote:
          "Liikkumisestani on tullut nopeampaa suunnanmuutoksissa ja suorissa juoksuissa… tunne liikkeen helppoudesta ja vapaudesta on ollut mahtavaa.",
        author: "Sebastian Dahlström",
        role: "Jalkapalloilija, KuPS",
      },
      {
        quote:
          "BeatSport-harjoitteet auttivat ymmärtämään liikettä uudella tavalla… liikesarjat ovat voimakkaampia vaikka tekeminen tuntuu rennommalta.",
        author: "Mira Sjövall",
        role: "Taekwondo, nuorten MM",
      },
      {
        quote:
          "Oikeanlainen kehon kannattelu helpotti rytmiikassa tempojen vaihtoa ja ajoituksia… ja nopeudessa dynamiikan vapauttamista oikeaan aikaan.",
        author: "Jaak Vainomaa & Tiina Tulikallio",
        role: "Tanssiurheilu, ammattilaisten 10-tanssin MM",
      },
      {
        quote:
          "Huomasin selvästi miten liikkeelle antautuminen on usein vaikeampaa kuin puskeminen… tekemällä vähemmän saa enemmän aikaan.",
        author: "Kiira Korpi",
        role: "Taitoluistelija",
      },
      {
        quote:
          "Kentällä jalkoja ei hapota kuten aiemmin… jaksan juosta enemmän ja kauemmin ja nopeat suunnanmuutokset ovat helpompia.",
        author: "Santeri Haarala",
        role: "Jalkapalloilija, Djurgården (Ruotsi)",
      },
    ],
    link: { label: "Katso lisää referenssejä", href: "/referenssit" },
  },

  howItFits: {
    kicker: "MISSÄ TOIMII",
    title: "Sopii monenlaiseen valmennukseen",
    items: [
      {
        title: "Joukkueet ja ryhmät",
        description:
          "Yhteinen malli ja selkeät merkinnät auttavat valmennustiimiä pysymään samalla linjalla.",
      },
      {
        title: "Yksilövalmennus",
        description:
          "Havainnot säilyvät, kehitystä on helppo tarkastella ajassa ja palata olennaiseen nopeasti.",
      },
      {
        title: "Seurat ja valmennusjohto",
        description:
          "Yhtenäinen toimintatapa ilman raskasta järjestelmää — selkeys ja jatkuvuus paranee.",
      },
    ],
  },

  closing: {
    title: "Kun malli on selkeä, valmennus rauhoittuu",
    lead:
      "BeatSport tukee valmentajan ajattelua, suunnittelua ja jatkuvuutta — arjen kannalta olennaisella tasolla.",
  },
};
