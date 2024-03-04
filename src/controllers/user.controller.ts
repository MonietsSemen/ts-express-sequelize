import { NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes } from 'sequelize';
import passport from 'passport';
import process from 'process';
import User from '@/models/user';
import { SafeController } from '@/controllers/decorators';
import Order from '@/models/order';
import env from "@/configs/env";

type LoadedUserResponse<T = any> = Response<T, { user: User; [index: string]: unknown }>;
class UserController {
  @SafeController
  static async load(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) throw res.status(NOT_FOUND).send();

    res.locals = { ...res.locals, user };
    next();
  }

  @SafeController
  static async show(_req: Request, res: LoadedUserResponse, _next: NextFunction) {
    // eslint-disable-next-line no-shadow
    const { user } = res.locals;

    const orders = await Order.findAll({
      where: {
        userId: user.id,
      },
    });

    res.json({ user: res.locals.user, userOrders: orders });
  }

  @SafeController
  static async list(_req: Request, res: Response, _next: NextFunction) {
    const users = await User.findAll();

    res.json({ users });
  }

  @SafeController
  static async create(req: Request, res: Response, _next: NextFunction) {
    const userData = req.body as CreationAttributes<User>;
    const users = await User.create(userData);

    res.json({ users });
  }

  @SafeController
  static async update(req: Request, res: LoadedUserResponse, _next: NextFunction) {
    const userData = req.body as CreationAttributes<User>;
    const users = await res.locals.user.update(userData);

    res.json({ users });
  }

  @SafeController
  static async destroy(_req: Request, res: LoadedUserResponse, _next: NextFunction) {
    await res.locals.user.destroy();

    res.status(NO_CONTENT).send();
  }

  @SafeController
  static async login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', { session: false }, (err: Error, user: User, info: any) => {
      if (err) {
        return next(err);
      }

      if (user) {
        req.logIn(user, (newErr) => {
          return newErr ? next(newErr) : res.redirect(env.productsUrl);
        });
      } else {
        res.redirect(env.userUrl);
      }
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

export default UserController;
