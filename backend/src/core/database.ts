import pg from 'pg';
import type { Database } from '../features/todos/types.js';

export function createDatabase(connectionString: string): pg.Pool {
  // Keep SQL DATE as a calendar date, independent of the server timezone.
  const types: pg.CustomTypesConfig = {
    getTypeParser: (oid, format) => oid === 1082 ? (value: string) => value : pg.types.getTypeParser(oid, format),
  };
  return new pg.Pool({ connectionString, types, connectionTimeoutMillis: 10000 });
}

export async function initialize(database: Database): Promise<void> {
  // Compatible with the existing SQLAlchemy table and sequence.
  await database.query(`CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL CONSTRAINT todo_title_not_empty CHECK (length(title) >= 1),
    description VARCHAR(2000) NOT NULL DEFAULT '',
    priority VARCHAR(6) NOT NULL DEFAULT 'medium' CONSTRAINT todo_priority CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  )`);
}
