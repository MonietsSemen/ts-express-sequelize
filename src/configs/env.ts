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
} as EnvConfig;
