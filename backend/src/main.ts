import { start } from './core/lifespan.js';

start().catch((error) => {
  console.error('Cannot start Taskly API:', error);
  process.exitCode = 1;
});
