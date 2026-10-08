import type { z } from 'zod';
import type { createSchema, updateSchema, todoSchema } from './validators.js';

export type TodoCreate = z.infer<typeof createSchema>;
export type TodoUpdate = z.infer<typeof updateSchema>;
export type Todo = z.infer<typeof todoSchema>;
export type TodoRecord = Omit<Todo, 'created_at' | 'updated_at'> & {
  created_at: Date;
  updated_at: Date;
};
export interface Database {
  query(text: string, values?: unknown[]): Promise<{ rows: TodoRecord[]; rowCount?: number | null }>;
}
export interface TodoStore {
  list(): Promise<Todo[]>;
  get(id: number): Promise<Todo | null>;
  create(payload: TodoCreate): Promise<Todo>;
  update(id: number, payload: TodoUpdate): Promise<Todo | null>;
  delete(id: number): Promise<boolean>;
}
