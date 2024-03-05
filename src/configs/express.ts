import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import process from 'process';
import errorHandler from '@/middlewares/error-handler';
import env from '@/configs//env';
import router from '@/routes/index';
import sequelize from '@/models/index';
import * as Strategies from '@/passport/strategies';
import * as Serializer from '@/passport/serializer';
import authRouter from '@/routes/auth.router';
import { ExtractJwt } from 'passport-jwt';
import { customJwt } from "@/passport/strategies";

const app: Application = express();

app.set('views', './src/views');
app.set('view engine', 'pug');

app.set('port', parseInt(env.port, 10));

app.use(morgan(env.logs));

app.use(methodOverride());
app.use(helmet());
app.use(cors());
app.disable('x-powered-by');

app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

if (!sequelize) throw new Error("Can't connect to database");

app.use(cookieParser());
app.use(session({ secret: env.sessionSecret }));

// Passport:
app.use(passport.initialize());
passport.use('customJwt', Strategies.customJwt);

// app.use(passport.session());
// passport.use('local', Strategies.local);
// Serializer:
// passport.serializeUser(Serializer.serialize);
// passport.deserializeUser(Serializer.deserialize);

app.use('/user', authRouter);
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
