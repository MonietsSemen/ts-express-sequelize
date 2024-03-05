import { NextFunction, Request, Response } from 'express';
import env from '@/configs/env';
import { SafeController } from '@/controllers/decorators';
import passport from 'passport';

export default class Authenticate {
  @SafeController
  static async mustAuthenticatedMw(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('customJwt', { session: false })(req, res, () => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.redirect(env.userUrl);
      }
    });
  }
}
