import { NextFunction, Request, Response } from 'express';
import { CreationAttributes } from 'sequelize';
import passport from 'passport';
import User from '@/models/user';
import { SafeController } from '@/controllers/decorators';
import env from '@/configs/env';

class AuthController {
  @SafeController
  static async login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', {
      successRedirect: env.productsUrl,
      failureRedirect: env.userUrl,
    })(req, res, next);
  }

  @SafeController
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.logout((err) => {
        console.error(err);
      });
      res.redirect(env.userUrl);
    } catch (e) {
      next(e);
    }
  }

  @SafeController
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body as CreationAttributes<User>;
      const user = await User.create(userData);

      await new Promise<void>((resolve, reject) => {
        req.logIn(user, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      res.redirect(env.productsUrl);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
