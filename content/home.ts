import { ROUTES } from "./site";

export const HOME = {
  hero: {
    h1: "Valmennuksen seuranta, palaute ja muistiot – yhdessä paikassa",
    lead:
      "BeatSport on valmentajille tehty web-sovellus, joka helpottaa arkea: harjoitusten seuranta, palaute ja valmennusmuistiot selkeästi ja järjestelmällisesti – lajista riippumatta.",
    primaryCta: { label: "Pyydä demo", href: ROUTES.demo },
    secondaryCta: { label: "Katso Web App", href: ROUTES.product },
    highlights: [
      "Toimii kaikissa urheilulajeissa",
      "Rakennettu valmentajien arkeen",
      "Selkeä käyttöönotto ja tuki",
    ],
  },

  problems: {
    title: "Valmentajan arki on täynnä tietoa – mutta harvoin yhdessä paikassa",
    items: [
      "Muistiinpanot ovat vihkoissa, puhelimessa ja viesteissä.",
      "Palaute katoaa tai unohtuu kiireessä.",
      "Kehityksen seuraaminen ajassa on vaikeaa.",
      "Valmennus perustuu helposti muistiin eikä kokonaiskuvaan.",
    ],
  },

  solution: {
    title: "BeatSport kokoaa valmennuksen olennaisen yhteen näkymään",
    lead:
      "Käytännönläheinen työkalu, joka tukee valmentajaa arjessa. Ei turhaa monimutkaisuutta – vain se, mitä valmentaja oikeasti tarvitsee.",
    features: [
      {
        title: "Harjoitusten seuranta",
        text: "Kirjaa treenit ja havainnot nopeasti ja löydä ne myöhemmin helposti.",
      },
      {
        title: "Valmennusmuistiot",
        text: "Pidä valmennuslinja yhtenäisenä ja palauta mieleen sovitut painotukset.",
      },
      {
        title: "Palaute urheilijoille",
        text: "Selkeä palaute, joka pysyy tallessa ja tukee kehittymistä.",
      },
      {
        title: "Kehitys näkyväksi",
        text: "Näe muutokset ajassa – päätökset ovat helpompia kun kokonaiskuva on selkeä.",
      },
    ],
  },

  howItWorks: {
    title: "Näin BeatSport toimii käytännössä",
    steps: [
      { title: "Kirjaa", text: "Valmentaja kirjaa harjoitukset ja havainnot." },
      { title: "Jaa", text: "Urheilija saa selkeän palautteen ja tavoitteet." },
      { title: "Seuraa", text: "Kehitystä voidaan seurata ajassa ja tarkentaa suuntaa." },
    ],
  },

  audience: {
    title: "Kenelle BeatSport on tehty?",
    cards: [
      { title: "Yksilövalmentajille", text: "Selkeyttä arkeen ja parempi kokonaiskuva." },
      { title: "Seuroille ja tiimeille", text: "Yhteinen rakenne ja dokumentointi valmennukseen." },
      { title: "Nuorista aikuisiin", text: "Toimii eri tasoilla ja eri tavoitteilla." },
      { title: "Kaikkiin lajeihin", text: "Ei lajisidonnainen – mukautuu valmennuksen tarpeisiin." },
    ],
    links: [
      { label: "Lue lisää: Web App", href: ROUTES.product },
      { label: "Valmentajille", href: ROUTES.coaches },
    ],
  },

  trust: {
    title: "Valmentajalta valmentajille",
    text:
      "BeatSportia kehitetään yhteistyössä aktiivisten valmentajien kanssa. Se perustuu todelliseen valmennustyöhön – ei oletuksiin.",
    stats: [
      // jätä tyhjäksi jos et halua lukuja vielä
      // { label: "Valmentajia käytössä", value: "—" },
      // { label: "Lajeja", value: "—" },
    ],
  },

  finalCta: {
    title: "Haluatko nähdä, miten BeatSport toimisi sinun valmennuksessasi?",
    text: "Pyydä demo – katsotaan yhdessä, miten tämä sopii juuri teidän arkeen.",
    primaryCta: { label: "Pyydä demo", href: ROUTES.demo },
    secondaryCta: { label: "Kirjaudu", href: ROUTES.login },
  },
} as const;
