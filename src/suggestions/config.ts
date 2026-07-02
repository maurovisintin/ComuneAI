import type { IconName } from "@/components/icons/icon";

export type Suggestion = {
  q: string;
  icon: IconName;
};

export const suggestions: Suggestion[] = [
  { q: "Orari dell'asilo nido", icon: "clock" },
  { q: "Quando scade l'IMU?", icon: "receipt" },
  { q: "Quando passa la differenziata?", icon: "leaf" },
  { q: "Rinnovo carta d'identità", icon: "id-card" },
];
