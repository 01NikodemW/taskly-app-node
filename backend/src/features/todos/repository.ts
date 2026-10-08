import { fromModel } from './mappers.js';
import type { Database, TodoStore, TodoCreate, TodoUpdate, Todo } from './types.js';

export class TodoRepository implements TodoStore {
  constructor(private readonly database: Database) {}

  async list(): Promise<Todo[]> {
    const { rows } = await this.database.query('SELECT * FROM todos ORDER BY created_at DESC, id DESC');
    return rows.map(fromModel);
  }

  async get(id: number): Promise<Todo | null> {
    const { rows } = await this.database.query('SELECT * FROM todos WHERE id = $1', [id]);
    return rows.length ? fromModel(rows[0]) : null;
  }

  async create(payload: TodoCreate): Promise<Todo> {
    const { title, description, priority, due_date, completed } = payload;
    const now = new Date();
    const { rows } = await this.database.query(
      `INSERT INTO todos (title, description, priority, due_date, completed, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING *`,
      [title, description, priority, due_date, completed, now],
    );
    return fromModel(rows[0]);
  }

  async update(id: number, payload: TodoUpdate): Promise<Todo | null> {
    const allowed = ['title', 'description', 'priority', 'due_date', 'completed'];
    const entries = Object.entries(payload);
    if (!entries.length || entries.some(([key]) => !allowed.includes(key))) {
      throw new Error('Invalid update fields.');
    }
    const assignments = entries.map(([key], index) => `${key} = $${index + 1}`);
    const values: unknown[] = entries.map(([, value]) => value);
    values.push(new Date(), id);
    const { rows } = await this.database.query(
      `UPDATE todos SET ${assignments.join(', ')}, updated_at = $${values.length - 1} WHERE id = $${values.length} RETURNING *`,
      values,
    );
    return rows.length ? fromModel(rows[0]) : null;
  }

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await this.database.query('DELETE FROM todos WHERE id = $1', [id]);
    return (rowCount ?? 0) > 0;
  }
}
