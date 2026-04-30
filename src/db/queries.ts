import { getDb } from "./index";

export type Role = "user" | "assistant" | "system";

export type Conversation = {
  id: string;
  tenantSlug: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type Message = {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  createdAt: number;
};

type ConversationRow = {
  id: string;
  tenant_slug: string;
  title: string;
  created_at: number;
  updated_at: number;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  role: Role;
  content: string;
  created_at: number;
};

const toConversation = (r: ConversationRow): Conversation => ({
  id: r.id,
  tenantSlug: r.tenant_slug,
  title: r.title,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toMessage = (r: MessageRow): Message => ({
  id: r.id,
  conversationId: r.conversation_id,
  role: r.role,
  content: r.content,
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
    "INSERT INTO conversations (id, tenant_slug, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [id, tenantSlug, "Nuova chat", now, now]
  );
  return {
    id,
    tenantSlug,
    title: "Nuova chat",
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

export function updateConversationTitle(id: string, title: string): void {
  getDb().runSync(
    "UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?",
    [title, Date.now(), id]
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
  return { id, conversationId, role, content, createdAt: now };
}

export function setMessageContent(id: string, content: string): void {
  getDb().runSync("UPDATE messages SET content = ? WHERE id = ?", [
    content,
    id,
  ]);
}
