import { Router, Response, Request, NextFunction } from 'express';
import UserController from '@/controllers/user.controller';

const router = Router();

router
  .get('/login', (req: Request, res: Response, next: NextFunction) => {
    res.render('login');
  })
  .post('/login', UserController.login);

router
  .get('/register', (req: Request, res: Response, next: NextFunction) => {
    res.render('register');
  })
  .post('/register', UserController.register);

router.get('/logout', UserController.logout);

export default router;
