import { Router, Request, Response } from 'express';
import orderRouter from '@/routes/order.router';
import userRouter from '@/routes/user.router';
import collectionRouter from '@/routes/collection.router';
import productRouter from '@/routes/product.router';
import Authenticate from '@/middlewares/auth';

const router = Router();

router.use('/users', Authenticate.mustAuthenticatedMw, userRouter);
router.use('/orders', Authenticate.mustAuthenticatedMw, orderRouter);
router.use('/collections', Authenticate.mustAuthenticatedMw, collectionRouter);
router.use('/products', Authenticate.mustAuthenticatedMw, productRouter);

router.get('/', (_req: Request, res: Response) => {
  res.json('Welcome to Express & TypeScript Server3423423');
});

export default router;
