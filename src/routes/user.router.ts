import { Router } from 'express';
import UserController from '@/controllers/user.controller';
import Authorization from '@/middlewares/authorization';

const router = Router();

router.param('userId', UserController.load);

router
  .route('/')
  .get(Authorization.roleVerification('admin'), UserController.list)
  .post(UserController.create);
router
  .route('/:userId')
  .get(Authorization.roleVerification('admin'), UserController.show)
  .put(UserController.update)
  .delete(UserController.destroy);

export default router;
