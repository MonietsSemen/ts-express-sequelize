import { Job } from 'bull';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

type PrintConsole = {
  userId: string;
};

export const printConsole = async (job: Job<PrintConsole>) => {
  try {
    console.log('Some print 1');
    await job.progress(20);
    await sleep(2000);
    console.log('Some print 2');
    await job.progress(50);
    await sleep(2000);
    console.log('Some print 3');
    await job.progress(100);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
