import { Router, Response, Request, NextFunction } from 'express';
import AuthController from '@/controllers/auth.controller';

const router = Router();

router
  .get('/login', (req: Request, res: Response, next: NextFunction) => {
    res.render('login');
  })
  .post('/login', AuthController.login);

router
  .get('/register', (req: Request, res: Response, next: NextFunction) => {
    res.render('register');
  })
  .post('/register', AuthController.register);

router.get('/logout', AuthController.logout);

export default router;
