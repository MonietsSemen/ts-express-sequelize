import Bull from 'bull';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import env from '@/configs/env';

const { redis } = env;

const config = {
  redis: {
    password: redis.password,
    port: parseInt(redis.port, 10),
    host: redis.host,
  },
};

const jobsWithUI = ['my-queue', 'second-process', 'timer'];

export default class JobFactory {
  static create(name: string) {
    return new Bull(name, config);
  }

  static createAll = () =>
    jobsWithUI.map((name) => {
      const job = new Bull(name, config);
      return new BullAdapter(job);
    });

  static async add(
    name: string,
    param: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) {
    const job = this.create(name);
    await job.add(param, { removeOnComplete: false, ...options });
  }
}
