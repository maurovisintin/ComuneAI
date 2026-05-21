import type { Conversation } from "@/db/queries";

export type GroupSection = "Oggi" | "Ieri" | "Settimana scorsa" | "Più vecchi";

export type ConversationGroup = {
  section: GroupSection;
  items: Conversation[];
};

const DAY = 24 * 60 * 60 * 1000;

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function groupConversations(items: Conversation[]): ConversationGroup[] {
  const todayStart = startOfDay(Date.now());
  const yesterdayStart = todayStart - DAY;
  const weekStart = todayStart - 7 * DAY;

  const buckets: Record<GroupSection, Conversation[]> = {
    Oggi: [],
    Ieri: [],
    "Settimana scorsa": [],
    "Più vecchi": [],
  };

  for (const c of items) {
    if (c.updatedAt >= todayStart) buckets.Oggi.push(c);
    else if (c.updatedAt >= yesterdayStart) buckets.Ieri.push(c);
    else if (c.updatedAt >= weekStart) buckets["Settimana scorsa"].push(c);
    else buckets["Più vecchi"].push(c);
  }

  return (
    ["Oggi", "Ieri", "Settimana scorsa", "Più vecchi"] as GroupSection[]
  )
    .map((section) => ({ section, items: buckets[section] }))
    .filter((g) => g.items.length > 0);
}

const WEEKDAY_SHORT = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];

export function shortItalianTime(timestamp: number): string {
  const todayStart = startOfDay(Date.now());
  const yesterdayStart = todayStart - DAY;
  const d = new Date(timestamp);
  if (timestamp >= todayStart) {
    return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  }
  if (timestamp >= yesterdayStart) return "ieri";
  if (timestamp >= todayStart - 7 * DAY) return WEEKDAY_SHORT[d.getDay()] ?? "—";
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
}
