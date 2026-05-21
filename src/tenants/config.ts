export type Tenant = {
  slug: string;
  name: string;
  region: string;
  province: string;
  systemPrompt: string;
};

const promptFor = (name: string) =>
  `Sei un assistente virtuale del Comune di ${name}. Aiuti i cittadini a trovare informazioni su servizi, uffici, scadenze e procedure amministrative. Rispondi sempre in italiano in modo chiaro, cortese e conciso. Se non conosci una risposta specifica, suggerisci di contattare lo sportello del cittadino.`;

export const tenants: Tenant[] = [
  {
    slug: "acquaviva-delle-fonti",
    name: "Acquaviva delle Fonti",
    region: "Puglia",
    province: "BA",
    systemPrompt: promptFor("Acquaviva delle Fonti"),
  },
  {
    slug: "alberobello",
    name: "Alberobello",
    region: "Puglia",
    province: "BA",
    systemPrompt: promptFor("Alberobello"),
  },
  {
    slug: "altamura",
    name: "Altamura",
    region: "Puglia",
    province: "BA",
    systemPrompt: promptFor("Altamura"),
  },
  {
    slug: "andria",
    name: "Andria",
    region: "Puglia",
    province: "BT",
    systemPrompt: promptFor("Andria"),
  },
  {
    slug: "bari",
    name: "Bari",
    region: "Puglia",
    province: "BA",
    systemPrompt: promptFor("Bari"),
  },
  {
    slug: "barletta",
    name: "Barletta",
    region: "Puglia",
    province: "BT",
    systemPrompt: promptFor("Barletta"),
  },
  {
    slug: "bitonto",
    name: "Bitonto",
    region: "Puglia",
    province: "BA",
    systemPrompt: promptFor("Bitonto"),
  },
  {
    slug: "brindisi",
    name: "Brindisi",
    region: "Puglia",
    province: "BR",
    systemPrompt: promptFor("Brindisi"),
  },
];

export const findTenant = (slug: string | undefined): Tenant | undefined =>
  slug ? tenants.find((t) => t.slug === slug) : undefined;
