export type Tenant = {
  slug: string;
  name: string;
  region: string;
  province: string;
  /** e.g. "Provincia di BA", "Città Metropolitana di BA" */
  provinceLabel: string;
  systemPrompt: string;
};

const promptFor = (name: string) =>
  `Sei un assistente virtuale del Comune di ${name}. Aiuti i cittadini a trovare informazioni su servizi, uffici, scadenze e procedure amministrative. Rispondi sempre in italiano in modo chiaro, cortese e conciso. Se non conosci una risposta specifica, suggerisci di contattare lo sportello del cittadino.`;

const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const comune = (
  name: string,
  province: string,
  provinceLabel = `Provincia di ${province}`
): Tenant => ({
  slug: slugify(name),
  name,
  region: "Puglia",
  province,
  provinceLabel,
  systemPrompt: promptFor(name),
});

export const tenants: Tenant[] = [
  comune("Acquaviva delle Fonti", "BA"),
  comune("Alberobello", "BA"),
  comune("Altamura", "BA"),
  comune("Andria", "BT"),
  comune("Bari", "BA", "Città Metropolitana di BA"),
  comune("Bitonto", "BA"),
  comune("Conversano", "BA"),
  comune("Gioia del Colle", "BA"),
  comune("Modugno", "BA"),
  comune("Molfetta", "BA", "Città Metropolitana di BA"),
  comune("Monopoli", "BA"),
  comune("Putignano", "BA"),
  comune("Trani", "BT"),
];

export const findTenant = (slug: string | undefined): Tenant | undefined =>
  slug ? tenants.find((t) => t.slug === slug) : undefined;

export const searchTenants = (query: string): Tenant[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return tenants.filter((t) => t.name.toLowerCase().includes(q));
};

/** Fallback for "Usa la mia posizione" — the demo pretends we're here. */
export const DEFAULT_TENANT_SLUG = "acquaviva-delle-fonti";
