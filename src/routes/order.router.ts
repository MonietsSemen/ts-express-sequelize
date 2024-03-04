import { Router } from 'express';
import OrderController from '@/controllers/order.controller';

const router = Router();

router.param('orderId', OrderController.load);

router.route('/').get(OrderController.list).post(OrderController.create);
router.route('/:orderId').get(OrderController.show).put(OrderController.update);

export default router;
