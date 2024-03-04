import { Router } from 'express';
import CollectionController from '@/controllers/collection.controller';
import CollectionFilters from '@/middlewares/collection-filters';

const router = Router();

router.param('collectionId', CollectionController.load);

router.route('/').get(CollectionController.list).post(CollectionController.create);
router
  .route('/:collectionId')
  .get(CollectionFilters.filterByDate, CollectionFilters.filterByPrice, CollectionController.show)
  .put(CollectionController.update)
  .delete(CollectionController.destroy);

export default router;
