import * as SQLite from "expo-sqlite";
import {
  SCHEMA_V1_SQL,
  SCHEMA_V2_SQL,
  SCHEMA_V3_REPORTS_SQL,
  SCHEMA_V3_SQL,
  SCHEMA_VERSION,
} from "./schema";

const DB_NAME = "comuni-chat.db";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync(DB_NAME);
    initialize(dbInstance);
  }
  return dbInstance;
}

function initialize(db: SQLite.SQLiteDatabase): void {
  db.execSync("PRAGMA journal_mode = WAL;");
  db.execSync("PRAGMA foreign_keys = ON;");

  const row = db.getFirstSync<{ user_version: number }>(
    "PRAGMA user_version;"
  );
  let current = row?.user_version ?? 0;

  if (current < 1) {
    db.execSync(SCHEMA_V1_SQL);
    current = 1;
  }
  if (current < 2) {
    try {
      db.execSync(SCHEMA_V2_SQL);
    } catch {
      // Column may already exist if the table was created fresh under v2.
    }
    current = 2;
  }
  if (current < 3) {
    try {
      db.execSync(SCHEMA_V3_SQL);
    } catch {
      // Column may already exist if the table was created fresh under v3.
    }
    db.execSync(SCHEMA_V3_REPORTS_SQL);
    current = 3;
  }

  db.execSync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
}
