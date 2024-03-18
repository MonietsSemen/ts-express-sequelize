import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Application } from 'express';
import env from '@/configs/env';

/**
 * Init logger
 */
export const init = (process: string, app?: Application, sentryEnv?: string) => {
  const { environment, dsn } = env.sentry;
  if (!environment || ['test', 'local'].includes(environment)) return;
  const params = {
    environment: sentryEnv || environment,
    dsn,
    ...(app && {
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({
          app,
        }),
      ],
      tracesSampleRate: 0.3,
    }),
  };
  // error tracking system
  Sentry.init(params);
  Sentry.configureScope((scope) => {
    scope.setTag('process', process);
  });

  return Sentry;
};
