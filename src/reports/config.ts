import type { IconName } from "@/components/icons/icon";
import type { ReportState } from "@/db/queries";

export type ReportCategory = {
  id: string;
  icon: IconName;
  label: string;
};

export const REPORT_CATEGORIES: ReportCategory[] = [
  { id: "strade", icon: "triangle-alert", label: "Strade e buche" },
  { id: "luce", icon: "lightbulb", label: "Illuminazione" },
  { id: "rifiuti", icon: "trash", label: "Rifiuti" },
  { id: "verde", icon: "leaf", label: "Verde pubblico" },
  { id: "acqua", icon: "droplets", label: "Acqua e fogne" },
  { id: "altro", icon: "more-horizontal", label: "Altro" },
];

export const findReportCategory = (id: string): ReportCategory =>
  REPORT_CATEGORIES.find((c) => c.id === id) ?? REPORT_CATEGORIES[0];

export const reportBadgeColors = (
  state: ReportState
): { bg: string; fg: string } => {
  switch (state) {
    case "Risolta":
      return { bg: "#E7F6EE", fg: "#0F6E40" };
    case "Ricevuta":
      return { bg: "#F3EEFB", fg: "#6C4FD0" };
    case "In lavorazione":
      return { bg: "#FBF1DE", fg: "#8E5400" };
  }
};
