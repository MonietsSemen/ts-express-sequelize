import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-ioredis';
import env from '@/configs/env';

const { redis } = env;

const redisCache = cacheManager.caching({
  password: redis.password,
  store: redisStore,
  host: redis.host,
  port: redis.port,
  username: 'default',
  db: 0,
  ttl: 60,
});

// @ts-ignore
const redisClient = redisCache.store.getClient();

redisClient.on('error', (err: Error) => {
  console.error(err);
});

export default redisCache;
