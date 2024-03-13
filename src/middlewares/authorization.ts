import { RequestHandler, NextFunction, Request, Response } from 'express';
import { GetUser, SafeController } from '@/controllers/decorators';
import User from '@/models/user';

export default class Authorization {
  static roleVerification(userRole: string): RequestHandler {
    // eslint-disable-next-line func-names
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        const localUser = req.user as User;

        if (!localUser) throw res.status(401).json();

        if (userRole !== localUser.role) {
          throw res.status(200).send({
            accountInfo: localUser,
            message: "You don't have enough permissions",
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

/* export default class Authorization {
  @GetUser
  @SafeController
  static async roleVerification(_req: Request, res: Response, next: NextFunction) {
    try {
      const { localUser } = res.locals;

      if (localUser.role !== 'admin') {
        throw res.status(200).send({
          accountInfo: localUser,
          message: "You're not enough permissions",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  }
} */
