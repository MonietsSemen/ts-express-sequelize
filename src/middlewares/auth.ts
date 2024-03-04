import { NextFunction, Request, Response } from 'express';
import env from '@/configs/env';
import { SafeController } from '@/controllers/decorators';

export default class Authenticate {
  @SafeController
  static async mustAuthenticatedMw(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect(env.userUrl);
    }
  }
}
