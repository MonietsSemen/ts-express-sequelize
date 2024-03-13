import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect();

redisClient.on('error', (err: Error) => {
  console.error(err);
});

export default redisClient;
