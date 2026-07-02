import { getDb } from "./index";

export type Role = "user" | "assistant" | "system";

export type Conversation = {
  id: string;
  tenantSlug: string;
  title: string;
  category: string | null;
  createdAt: number;
  updatedAt: number;
};

export type MessageSource = {
  label: string;
  /** Short mono reference, e.g. "art. 8" */
  meta?: string;
  /** External link (renders the external-link icon). */
  ext?: boolean;
};

export type MessageMeta = {
  highlight?: { title: string; lines: string[] };
  sources?: MessageSource[];
  verified?: boolean;
};

export type Message = {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  meta: MessageMeta | null;
  createdAt: number;
};

type ConversationRow = {
  id: string;
  tenant_slug: string;
  title: string;
  category: string | null;
  created_at: number;
  updated_at: number;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  role: Role;
  content: string;
  meta: string | null;
  created_at: number;
};

const toConversation = (r: ConversationRow): Conversation => ({
  id: r.id,
  tenantSlug: r.tenant_slug,
  title: r.title,
  category: r.category ?? null,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const parseMeta = (raw: string | null): MessageMeta | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MessageMeta;
  } catch {
    return null;
  }
};

const toMessage = (r: MessageRow): Message => ({
  id: r.id,
  conversationId: r.conversation_id,
  role: r.role,
  content: r.content,
  meta: parseMeta(r.meta),
  createdAt: r.created_at,
});

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function listConversations(tenantSlug: string): Conversation[] {
  const rows = getDb().getAllSync<ConversationRow>(
    "SELECT * FROM conversations WHERE tenant_slug = ? ORDER BY updated_at DESC",
    [tenantSlug]
  );
  return rows.map(toConversation);
}

export function createConversation(tenantSlug: string): Conversation {
  const now = Date.now();
  const id = uuid();
  getDb().runSync(
    "INSERT INTO conversations (id, tenant_slug, title, category, created_at, updated_at) VALUES (?, ?, ?, NULL, ?, ?)",
    [id, tenantSlug, "Nuova chat", now, now]
  );
  return {
    id,
    tenantSlug,
    title: "Nuova chat",
    category: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function getConversation(id: string): Conversation | null {
  const row = getDb().getFirstSync<ConversationRow>(
    "SELECT * FROM conversations WHERE id = ?",
    [id]
  );
  return row ? toConversation(row) : null;
}

export function updateConversationTitle(
  id: string,
  title: string,
  category: string | null
): void {
  getDb().runSync(
    "UPDATE conversations SET title = ?, category = ?, updated_at = ? WHERE id = ?",
    [title, category, Date.now(), id]
  );
}

export function touchConversation(id: string): void {
  getDb().runSync("UPDATE conversations SET updated_at = ? WHERE id = ?", [
    Date.now(),
    id,
  ]);
}

export function deleteConversation(id: string): void {
  getDb().runSync("DELETE FROM conversations WHERE id = ?", [id]);
}

export function listMessages(conversationId: string): Message[] {
  const rows = getDb().getAllSync<MessageRow>(
    "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
    [conversationId]
  );
  return rows.map(toMessage);
}

export function insertMessage(
  conversationId: string,
  role: Role,
  content: string
): Message {
  const now = Date.now();
  const id = uuid();
  getDb().runSync(
    "INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
    [id, conversationId, role, content, now]
  );
  return { id, conversationId, role, content, meta: null, createdAt: now };
}

export function setMessageContent(id: string, content: string): void {
  getDb().runSync("UPDATE messages SET content = ? WHERE id = ?", [
    content,
    id,
  ]);
}

export function setMessageMeta(id: string, meta: MessageMeta): void {
  getDb().runSync("UPDATE messages SET meta = ? WHERE id = ?", [
    JSON.stringify(meta),
    id,
  ]);
}

// ---------------------------------------------------------------------------
// Segnalazioni (citizen reports)
// ---------------------------------------------------------------------------

export type ReportState = "Ricevuta" | "In lavorazione" | "Risolta";

export type Report = {
  id: string;
  tenantSlug: string;
  category: string;
  text: string;
  state: ReportState;
  createdAt: number;
};

type ReportRow = {
  id: string;
  tenant_slug: string;
  category: string;
  text: string;
  state: ReportState;
  created_at: number;
};

const toReport = (r: ReportRow): Report => ({
  id: r.id,
  tenantSlug: r.tenant_slug,
  category: r.category,
  text: r.text,
  state: r.state,
  createdAt: r.created_at,
});

export function listReports(tenantSlug: string): Report[] {
  const rows = getDb().getAllSync<ReportRow>(
    "SELECT * FROM reports WHERE tenant_slug = ? ORDER BY created_at DESC",
    [tenantSlug]
  );
  return rows.map(toReport);
}

export function createReport(
  tenantSlug: string,
  category: string,
  text: string
): Report {
  const now = Date.now();
  const id = uuid();
  getDb().runSync(
    "INSERT INTO reports (id, tenant_slug, category, text, state, created_at) VALUES (?, ?, ?, ?, 'Ricevuta', ?)",
    [id, tenantSlug, category, text, now]
  );
  return { id, tenantSlug, category, text, state: "Ricevuta", createdAt: now };
}
