import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-ioredis';
import env from '@/configs/env';

const { redis } = env;

const redisCache = cacheManager.caching({
  store: redisStore,
  host: redis.host,
  port: redis.port,
  password: redis.password,
  maxSize: 10000000, // 10 mb
  db: 0,
  ttl: 60,
});

// @ts-ignore
const redisClient = redisCache.store.getClient();

redisClient.on('error', (err: Error) => {
  console.error(err);
});

export default redisCache;
