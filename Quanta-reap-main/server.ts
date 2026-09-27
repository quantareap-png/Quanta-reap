/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createApiRouter } from './src/server/router';
import { createLogger } from './src/lib/logger';

const logger = createLogger('Server');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON and URL-encoded bodies
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API routes mount FIRST before any Vite or static handler
  app.use('/api', createApiRouter());

  // Vite middleware in development, static files in production
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Mounting Vite middleware in development mode');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    logger.info('Serving static build from dist folder in production mode');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Quanta server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  logger.error('Failed to start Quanta server', err);
  process.exit(1);
});
