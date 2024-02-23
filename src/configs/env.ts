import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

type EnvConfig = {
  nodeEnv: 'development' | 'test' | 'production';
  port: string;
  logs: 'common' | 'dev';
};

export default {
  nodeEnv,
  port: process.env.PORT || '8080',
  logs: 'dev',
} as EnvConfig;
