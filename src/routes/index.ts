import { Router, Request, Response } from 'express';
import orderRouter from '@/routes/order.router';
import userRouter from '@/routes/user.router';

const router = Router();

router.use('/users', userRouter);
router.use('/orders', orderRouter);

router.get('/', (_req: Request, res: Response) => {
  res.json('Welcome to Express & TypeScript Server3423423');
});

export default router;
