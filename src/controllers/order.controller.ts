import { NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes } from 'sequelize';
import Order from '@/models/order';
import User from '@/models/user';
import { SafeController } from '@/controllers/decorators';

type LoadedOrderResponse<T = any> = Response<T, { order: Order; [index: string]: unknown }>;
class OrderController {
  @SafeController
  static async load(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (!order) throw res.status(NOT_FOUND).send();

    res.locals = { ...res.locals, order };
    next();
  }

  @SafeController
  static async show(_req: Request, res: LoadedOrderResponse, _next: NextFunction) {
    res.json({ order: res.locals.order });
  }

  @SafeController
  static async list(_req: Request, res: Response, _next: NextFunction) {
    const orders = await Order.findAll();

    res.json({ orders });
  }

  @SafeController
  static async create(req: Request, res: Response, _next: NextFunction) {
    const orderData = req.body as CreationAttributes<Order>;
    const { userId } = req.body;
    const user = await User.findByPk(userId);

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
}

export default OrderController;
