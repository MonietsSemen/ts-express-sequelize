import { NextFunction, Request, Response } from 'express';
import { GetUser, SafeController } from '@/controllers/decorators';

export default class Authorization {
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
}
