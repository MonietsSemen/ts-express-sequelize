import { Router } from 'express';
import UserController from '@/controllers/user.controller';

const router = Router();

router.param('userId', UserController.load);

router.route('/').get(UserController.list).post(UserController.create);
router
  .route('/:userId')
  .get(UserController.show)
  .put(UserController.update)
  .delete(UserController.destroy);

export default router;
