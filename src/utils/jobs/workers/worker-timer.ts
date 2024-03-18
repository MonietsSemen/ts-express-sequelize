import { Job } from 'bull';

type dateNow = {
  today: string;
};

export const timer = async (job: Job<dateNow>) => {
  try {
    const { today } = job.data;
    console.log('start save quiz result job', today, job.data);
    await job.progress(100);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
