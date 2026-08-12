import { createApp } from './app';
import { env } from './config/env';
import { checkDatabaseConnection, pool } from './database/pool';
import { logger } from './shared/logger';

const app = createApp();
const port = env.PORT;

const server = app.listen(port, async () => {
  const dbUp = await checkDatabaseConnection();
  logger.info(`Meridia API en http://localhost:${port} (db: ${dbUp ? 'conectada' : 'NO DISPONIBLE'})`);
});

const shutdown = (signal: NodeJS.Signals): void => {
  logger.info({ signal }, 'Recibida señal de apagado, cerrando servidor');

  server.close(() => {
    void (async () => {
      await pool.end();
      logger.info('Servidor apagado correctamente');
      process.exit(0);
    })();
  });

  setTimeout(() => {
    logger.error('Forzando cierre tras 10s');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));