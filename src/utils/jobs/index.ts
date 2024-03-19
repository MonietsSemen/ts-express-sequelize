import * as sentry from '@/configs/sentry';
import sequelize from '@/models/index';
import JobFactory from './bull-factory';
import * as Workers from '@/utils/jobs/workers';

if (!sequelize) throw new Error("Can't connect to database");

sentry.init('JOBS');

JobFactory.create('second-process').process(Workers.findUsers);
JobFactory.create('my-queue').process(Workers.printConsole);
JobFactory.create('timer').process(Workers.printConsole);
