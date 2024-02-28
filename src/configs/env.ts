import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

type EnvConfig = {
  nodeEnv: 'development' | 'test' | 'production';
  port: string;
  logs: 'common' | 'dev';
  domain: string;
};

export default {
  nodeEnv,
  port: process.env.PORT || '8080',
  logs: 'dev',
  domain: `http://${process.env.DB_HOST}:${process.env.PORT}`,
} as EnvConfig;
