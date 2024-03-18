import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

type EnvConfig = {
  nodeEnv: 'development' | 'test' | 'production';
  port: string;
  logs: 'common' | 'dev';
  domain: string;
  productsUrl: string;
  userUrl: string;
  sessionTokenTime: string;
  sessionSecret: string;
  redis: {
    host: string;
    password: string;
    port: string;
  };
  sentry: {
    environment: string;
    dsn: string;
  };
};

export default {
  nodeEnv,
  port: process.env.PORT || '8080',
  logs: 'dev',
  domain: `${process.env.DOMAIN}${process.env.PORT}`,
  productsUrl: '/api/products',
  userUrl: '/user/login',
  sessionTokenTime: '1h',
  sessionSecret: process.env.SESSION_SECRET,
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
  },
  sentry: {
    environment: process.env.SENTRY_ENVIRONMENT,
    dsn: process.env.SENTRY_URL,
  },
} as EnvConfig;
