import { NextFunction, Request, Response } from 'express';
import { CreationAttributes } from 'sequelize';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import { SafeController } from '@/controllers/decorators';
import env from '@/configs/env';
import { NOT_FOUND } from "http-status";

class AuthController {
  @SafeController
  static async login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      'local',
      { session: false },
      async (err: Error, user: User, info: any) => {
        if (err) return next(err);
        if (!user) return res.redirect(`${env.userUrl}?error=invalid_credentials`);

        const token = await AuthController.generateToken(user);
        res.json({
          your_private_token_for_next_time: {
            expired_time: env.sessionTokenTime,
            token,
          },
        });
      },
    )(req, res, next);
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

  static async generateToken(user: User) {
    return jwt.sign({ sub: user.id, email: user.email }, env.sessionSecret, {
      expiresIn: env.sessionTokenTime,
    });
  }
}

export default AuthController;
