import { pino } from 'pino';
import { pinoHttp } from 'pino-http';
import { env } from '../config/env';

const level = env.NODE_ENV === 'test' ? 'silent' : env.NODE_ENV === 'production' ? 'info' : 'debug';

export const logger = pino({
  level,
  ...(env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:HH:MM:ss' },
        },
      }
    : {}),
});

export const httpLogger = pinoHttp({
  logger,
  autoLogging: { ignore: (req) => req.url === '/health' },
});
