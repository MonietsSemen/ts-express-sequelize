import { Job } from 'bull';
import User from '@/models/user';

type SaveUsers = {
  users: User[];
};

export const findUsers = async (job: Job<SaveUsers>) => {
  try {
    console.info('start save quiz result job');
    console.log('end save quiz result job');
    await job.progress(100);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
