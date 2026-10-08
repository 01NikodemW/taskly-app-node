import { Router } from 'express';
import type { Database } from '../features/todos/types.js';

export function createHealthRouter(database: Database) {
  const router = Router();
  router.get('/health', async (req, res) => {
    await database.query('SELECT id FROM todos LIMIT 1');
    res.json({ status: 'ok' });
  });
  return router;
}
