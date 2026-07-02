import type { IconName } from "@/components/icons/icon";

export type Story = {
  label: string;
  icon: IconName;
  kicker: string;
  title: string;
  body: string;
};

export const storiesFor = (comuneName: string): Story[] => [
  {
    label: `Comune di ${comuneName}`,
    icon: "compass",
    kicker: "Canale ufficiale",
    title: "Benvenuto nel canale ufficiale",
    body: "Qui trovi avvisi, scadenze e novità verificate del Comune. Niente fake news: solo fonti ufficiali.",
  },
  {
    label: "Allerta meteo",
    icon: "triangle-alert",
    kicker: "Protezione civile",
    title: "Allerta meteo arancione domani",
    body: "Previste piogge intense dalle 6 alle 18. Si raccomanda prudenza negli spostamenti e di limitare le uscite non necessarie.",
  },
  {
    label: "Eventi",
    icon: "calendar",
    kicker: "Eventi & cultura",
    title: "Torna la festa patronale",
    body: "Dal 12 al 14 luglio, eventi e concerti in piazza per la festa di Sant'Eustachio. Programma completo nella sezione Eventi.",
  },
  {
    label: "Bandi",
    icon: "megaphone",
    kicker: "Avvisi & bandi",
    title: 'Bando "Nido Gratis" 2025',
    body: "Aperte le domande per il contributo che azzera la retta dell'asilo nido. Scadenza 30 settembre.",
  },
  {
    label: "Lavori",
    icon: "triangle-alert",
    kicker: "Viabilità",
    title: "Via Roma chiusa al traffico",
    body: "Lavori di riasfaltatura fino al 30 giugno. Percorso alternativo da via Garibaldi.",
  },
];
