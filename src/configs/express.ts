import express, { Application } from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from '@/middlewares/error-handler';
import env from '@/configs//env';
import router from '@/routes/index';
import sequelize from '@/models/index';

const app: Application = express();

app.set('port', parseInt(env.port, 10));

app.use(morgan(env.logs));

app.use(methodOverride());
app.use(helmet());
app.use(cors());
app.disable('x-powered-by');

app.use(bodyParser.json({ limit: '15mb' }));

if (!sequelize) throw new Error("Can't connect to database");

app.use('/api', router);
app.use(errorHandler);

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err: Error) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

export default app;
