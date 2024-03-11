import { Router } from 'express';
import UserController from '@/controllers/user.controller';
import Authorization from '@/middlewares/authorization';

const router = Router();

router.param('userId', UserController.load);

router
  .route('/')
  .get(Authorization.roleVerification, UserController.list)
  .post(UserController.create);
router
  .route('/:userId')
  .get(Authorization.roleVerification, UserController.show)
  .put(UserController.update)
  .delete(UserController.destroy);

export default router;
