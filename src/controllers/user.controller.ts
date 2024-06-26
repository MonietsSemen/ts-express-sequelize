import { NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes } from 'sequelize';
import User from '@/models/user';
import { GetUser, SafeController } from '@/controllers/decorators';
import cache from '@/utils/cashe';
import JobFactory from '@/utils/jobs/bull-factory';

type LoadedUserResponse<T = any> = Response<
  T,
  { user: User; localUser: User; [index: string]: unknown }
>;

class UserController {
  @GetUser
  @SafeController
  static async load(_req: Request, res: Response, next: NextFunction) {
    const { localUser } = res.locals;
    const user = await User.findByPk(localUser.id);

    if (!user) throw res.status(NOT_FOUND).send();

    res.locals = { ...res.locals, user };
    next();
  }

  @GetUser
  @SafeController
  static async show(req: Request, res: LoadedUserResponse, _next: NextFunction) {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    res.json({ user });
  }

  @GetUser
  @SafeController
  static async showAlt(req: Request, res: LoadedUserResponse, _next: NextFunction) {
    const { userId } = req.params;
    const delay = '10000';
    await JobFactory.add('my-queue', { userId }, { delay });

    const user = await cache.wrap(`${userId}`, async () => {
      return User.findByPk(userId).then(async (newUser) => {
        return newUser;
      });
    });

    res.json({ user });
  }

  @SafeController
  static async list(_req: Request, res: Response, _next: NextFunction) {
    const users = await User.findAll();

    res.json({ users });
  }

  @SafeController
  static async listAlt(_req: Request, res: Response, _next: NextFunction) {
    const users = await cache.wrap('allUsers', async () => {
      return User.findAll().then(async (newUsers) => {
        return newUsers;
      });
    });

    await JobFactory.add('second-process', { users });

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
