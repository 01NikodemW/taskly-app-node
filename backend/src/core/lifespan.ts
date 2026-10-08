import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createDatabase, initialize } from './database.js';
import { resolveDatabaseUrl } from './config.js';
import { createApp } from '../factory.js';

export async function start() {
  const database = createDatabase(resolveDatabaseUrl());
  database.on('error', (error) => console.error('PostgreSQL pool error:', error));
  try {
    await initialize(database);
    const app = createApp(database);
    const server = await new Promise<Server>((resolve, reject) => {
      const listener = app.listen(Number(process.env.API_PORT || 8000), '0.0.0.0', () => resolve(listener));
      listener.once('error', reject);
    });
    console.log(`Taskly API listening on port ${(server.address() as AddressInfo).port}`);
    const shutdown = () => {
      const timeout = setTimeout(() => process.exit(1), 10000);
      timeout.unref();
      server.close(async () => {
        try { await database.end(); } catch (error) { console.error(error); process.exitCode = 1; }
        clearTimeout(timeout);
      });
    };
    process.once('SIGTERM', shutdown);
    process.once('SIGINT', shutdown);
    return { server, database };
  } catch (error) {
    await database.end();
    throw error;
  }
}
