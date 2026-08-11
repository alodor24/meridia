import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { checkDatabaseConnection } from './database/pool';
import { csrfProtection } from './middlewares/csrf';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { accountsRouter } from './modules/accounts/accounts.routes';
import { authRouter } from './modules/auth/auth.routes';
import { categoriesRouter } from './modules/categories/categories.routes';
import { dashboardRouter } from './modules/dashboard/dashboard.routes';
import { transactionsRouter } from './modules/transactions/transactions.routes';
import { httpLogger } from './shared/logger';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(httpLogger);
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  app.get('/health', async (_req, res) => {
    const dbUp = await checkDatabaseConnection();
    res.status(dbUp ? 200 : 503).json({
      success: true,
      data: {
        status: dbUp ? 'ok' : 'degraded',
        db: dbUp ? 'up' : 'down',
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.use(csrfProtection);
  app.use('/api/auth', authRouter);
  app.use('/api/accounts', accountsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/transactions', transactionsRouter);
  app.use('/api/dashboard', dashboardRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
