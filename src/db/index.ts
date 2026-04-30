import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL, SCHEMA_VERSION } from "./schema";

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
  const current = row?.user_version ?? 0;

  if (current < SCHEMA_VERSION) {
    db.execSync(SCHEMA_SQL);
    db.execSync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
  }
}
