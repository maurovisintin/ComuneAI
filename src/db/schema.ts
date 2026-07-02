export const SCHEMA_VERSION = 3;

export const SCHEMA_V1_SQL = `
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  tenant_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS conversations_tenant_idx
  ON conversations(tenant_slug, updated_at DESC);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS messages_conversation_idx
  ON messages(conversation_id, created_at);
`;

export const SCHEMA_V2_SQL = `
ALTER TABLE conversations ADD COLUMN category TEXT;
`;

export const SCHEMA_V3_SQL = `
ALTER TABLE messages ADD COLUMN meta TEXT;
`;

export const SCHEMA_V3_REPORTS_SQL = `
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  tenant_slug TEXT NOT NULL,
  category TEXT NOT NULL,
  text TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('Ricevuta','In lavorazione','Risolta')),
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS reports_tenant_idx
  ON reports(tenant_slug, created_at DESC);
`;
