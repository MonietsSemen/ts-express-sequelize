import { NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes } from 'sequelize';
import User from '@/models/user';
import { SafeController } from '@/controllers/decorators';
import Order from '@/models/order';

type LoadedUserResponse<T = any> = Response<T, { user: User; [index: string]: unknown }>;
class UserController {
  @SafeController
  static async load(req: Request, res: Response, next: NextFunction) {
    const localUser = UserController.getUser(req, res, next);
    const user = await User.findByPk(localUser.id);

    if (!user) throw res.status(NOT_FOUND).send();

    res.locals = { ...res.locals, user };
    next();
  }

  @SafeController
  static async show(req: Request, res: LoadedUserResponse, next: NextFunction) {
    const localUser = UserController.getUser(req, res, next);
    type NewResponse = {
      user: User;
      message?: string;
    };

    const newResponse: NewResponse = {
      user: res.locals.user,
    };

    if (localUser.role !== 'admin')
      newResponse.message = "You're not enough permissions for see another accounts";
    res.json({ newResponse });
  }

  @SafeController
  static async list(req: Request, res: Response, next: NextFunction) {
    const localUser = UserController.getUser(req, res, next);
    if (localUser.role !== 'admin') throw res.status(200).send("You're not enough permissions");
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

  static getUser(req: Request, res: Response, _next: NextFunction) {
    const localUser = (req.user as User)?.dataValues;

    if (!localUser) throw res.status(NOT_FOUND).send();

    return localUser;
  }
}

export default UserController;
