import { CATEGORIES, type CategoryKey } from "@/design/tokens";

const RULES: { keywords: RegExp; category: CategoryKey }[] = [
  { keywords: /\b(residenza|anagrafe|stato di famiglia|cambio|atti)\b/i, category: "Anagrafe" },
  { keywords: /\b(imu|tari|tasi|tributi|tributo|tassa|bollo|pagopa)\b/i, category: "Tributi" },
  { keywords: /\b(raccolta|differenziata|rifiuti|ambiente|riciclo|isola ecologica)\b/i, category: "Ambiente" },
  { keywords: /\b(scuola|mensa|asilo|nido|scolastic[oa]|libri di testo)\b/i, category: "Scuola" },
  { keywords: /\b(ztl|parcheggio|sosta|mobilit[àa]|trasloco|trasporto)\b/i, category: "Mobilità" },
  { keywords: /\b(bonus|welfare|sussidio|contributo|assistenza)\b/i, category: "Welfare" },
  { keywords: /\b(urp|accesso|reclamo|segnalazione)\b/i, category: "URP" },
];

export function inferCategory(text: string): CategoryKey {
  for (const r of RULES) {
    if (r.keywords.test(text)) return r.category;
  }
  return "Generale";
}

export function categoryStyle(cat: string | null | undefined) {
  const key = (cat && (cat as CategoryKey)) ?? "Generale";
  return CATEGORIES[key in CATEGORIES ? (key as CategoryKey) : "Generale"];
}
