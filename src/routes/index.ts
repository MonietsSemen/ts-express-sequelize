import { Router, Request, Response } from 'express';
import orderRouter from '@/routes/order.router';
import userRouter from '@/routes/user.router';
import collectionRouter from '@/routes/collection.router';
import productRouter from '@/routes/product.router';

const router = Router();

router.use('/users', userRouter);
router.use('/orders', orderRouter);
router.use('/collections', collectionRouter);
router.use('/products', productRouter);

router.get('/', (_req: Request, res: Response) => {
  res.json('Welcome to Express & TypeScript Server3423423');
});

export default router;
