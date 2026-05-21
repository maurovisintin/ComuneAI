import type { IconName } from "@/components/icons/icon-paths";
import { C } from "@/design/tokens";

export type Suggestion = {
  cat: string;
  q: string;
  icon: IconName;
  accent: string;
};

export const suggestions: Suggestion[] = [
  {
    cat: "Anagrafe",
    q: "Come richiedo un certificato di residenza?",
    icon: "doc",
    accent: C.blue,
  },
  {
    cat: "Tributi",
    q: "Quando scade la seconda rata IMU?",
    icon: "euro",
    accent: C.red,
  },
  {
    cat: "Ambiente",
    q: "Calendario raccolta differenziata in via Roma",
    icon: "recycle",
    accent: C.green,
  },
  {
    cat: "Scuola",
    q: "Iscrizione alla mensa scolastica",
    icon: "school",
    accent: C.green,
  },
  {
    cat: "Mobilità",
    q: "Permesso ZTL temporaneo per trasloco",
    icon: "car",
    accent: C.blueLight,
  },
];
