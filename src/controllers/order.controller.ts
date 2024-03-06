import { NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes } from 'sequelize';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Order from '@/models/order';
import User from '@/models/user';
import { SafeController } from '@/controllers/decorators';
import authController from '@/controllers/auth.controller';

type LoadedOrderResponse<T = any> = Response<T, { order: Order; [index: string]: unknown }>;

class OrderController {
  @SafeController
  static async load(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;
    const localUser = OrderController.getUser(req, res, next);
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: localUser.id,
      },
    });

    if (!order) throw res.status(NOT_FOUND).send();

    res.locals = { ...res.locals, order };
    next();
  }

  @SafeController
  static async show(_req: Request, res: LoadedOrderResponse, _next: NextFunction) {
    res.json({ order: res.locals.order });
  }

  @SafeController
  static async list(req: Request, res: Response, next: NextFunction) {
    const localUser = OrderController.getUser(req, res, next);

    const orders = await Order.findAll({
      where: {
        userId: localUser.id,
      },
    });

    res.json({ orders });
  }

  @SafeController
  static async create(req: Request, res: Response, next: NextFunction) {
    const orderData = req.body as CreationAttributes<Order>;
    const localUser = OrderController.getUser(req, res, next);
    const user = await User.findByPk(localUser.id);

    if (!user) throw res.status(NOT_FOUND).send('User not found');

    const orders = await user?.createOrder(orderData);

    res.json({ orders });
  }

  @SafeController
  static async update(req: Request, res: Response, _next: NextFunction) {
    const orderData = req.body as CreationAttributes<Order>;
    const orders = await res.locals.order.update(orderData);

    res.json({ orders });
  }

  static getUser(req: Request, res: Response, _next: NextFunction) {
    const localUser = (req.user as User)?.dataValues;

    if (!localUser) throw res.status(NOT_FOUND).send();

    return localUser;
  }
}

export default OrderController;
