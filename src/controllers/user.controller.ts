import { NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes } from 'sequelize';
import User from '@/models/user';
import { SafeController } from '@/controllers/decorators';

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
    res.json({ user: res.locals.user });
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
}

export default UserController;
