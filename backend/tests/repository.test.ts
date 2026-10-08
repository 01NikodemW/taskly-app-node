import { it, expect, vi } from 'vitest';
import { TodoRepository } from '../src/features/todos/repository.ts';
import { record, todo } from './fixture.ts';

it('lists tasks in newest-first order and maps database rows', async () => {
  const database = { query: vi.fn().mockResolvedValue({ rows: [record] }) };
  expect(await new TodoRepository(database).list()).toEqual([todo]);
  expect(database.query).toHaveBeenCalledWith('SELECT * FROM todos ORDER BY created_at DESC, id DESC');
});
it('gets a task using a parameterized query', async () => {
  const database = { query: vi.fn().mockResolvedValue({ rows: [record] }) };
  expect(await new TodoRepository(database).get(1)).toEqual(todo);
  expect(database.query).toHaveBeenCalledWith('SELECT * FROM todos WHERE id = $1', [1]);
});
