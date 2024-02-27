import { Router } from 'express';
import ProductController from '@/controllers/product.controller';

const router = Router();

router.param('productId', ProductController.load);

router.route('/').get(ProductController.list).post(ProductController.create);
router.route('/:productId').get(ProductController.show).put(ProductController.update);

export default router;

//  .delete(ProductController.destroy);
