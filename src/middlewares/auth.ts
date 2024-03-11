import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import env from '@/configs/env';
import { SafeController } from '@/controllers/decorators';
import { customJwt } from '@/passport/strategies';
import User from '@/models/user';

export default class Authenticate {
  @SafeController
  static async mustAuthenticatedMw(req: Request, res: Response, next: NextFunction) {
    try {
      passport.authenticate('customJwt', {
        session: false,
        failureRedirect: env.userUrl,
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
