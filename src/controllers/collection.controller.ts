import { NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes, Op } from 'sequelize';
import { SafeController } from '@/controllers/decorators';
import Collection from '@/models/collection';
import Product from '@/models/product';

// eslint-disable-next-line max-len
type LoadedCollectionResponse<T = any> = Response<
  T,
  { collection: Collection; [index: string]: unknown }
>;

class CollectionController {
  @SafeController
  static async load(req: Request, res: Response, next: NextFunction) {
    const { collectionId } = req.params;
    const collection = await Collection.findByPk(collectionId);

    if (!collection) throw res.status(NOT_FOUND).send('Collections not found');

    res.locals = { ...res.locals, collection };
    next();
  }

  @SafeController
  static async show(_req: Request, res: LoadedCollectionResponse, _next: NextFunction) {
    // eslint-disable-next-line no-shadow
    const { collection } = res.locals;

    // filtration
    const { priceMin, priceMax, page, limit } = _req.query;
    const defaultMinCheckPrice = 0;
    const defaultMaxCheckPrice = 999999;

    const priceMinNumber: number = parseInt(priceMin as string, 10) || defaultMinCheckPrice;
    const priceMaxNumber: number = parseInt(priceMax as string, 10) || defaultMaxCheckPrice;

    // pagination
    const defaultLimit = 50;
    const defaultOffsetNumber = 1;
    const limitNumber: number = parseInt(limit as string, 10) || defaultLimit;
    const offsetNumber: number = parseInt(page as string, 10) || defaultOffsetNumber;

    const products = await Product.findAndCountAll({
      where: {
        collectionId: collection.id,
        price: {
          [Op.between]: [priceMinNumber, priceMaxNumber],
        },
      },
      offset: offsetNumber,
      limit: limitNumber,
    });

    const allPagesCount = Math.ceil(
      products.count / limitNumber > 1 ? products.count / limitNumber : 1,
    );
    const nextPageUrl: string | null =
      offsetNumber >= allPagesCount
        ? null
        : `${_req.baseUrl}/${collection.id}?priceMin=${priceMin || ''}&priceMax=${
            priceMax || ''
          }&page=${offsetNumber + 1}&limit=${limit || ''}`;
    const prevPageUrl: string | null =
      offsetNumber <= 1
        ? null
        : `${_req.baseUrl}/${collection.id}?priceMin=${priceMin || ''}&priceMax=${
            priceMax || ''
          }&page=${offsetNumber - 1}&limit=${limit || ''}`;

    res.json({
      collection: res.locals.collection,
      collectionProducts: products,
      pagination: {
        allProductsCount: products.count,
        currentPage: offsetNumber,
        allPages: allPagesCount,
        nextUrl: nextPageUrl,
        prevUrl: prevPageUrl,
      },
    });
  }

  @SafeController
  static async list(_req: Request, res: Response, _next: NextFunction) {
    const collections = await Collection.findAll();

    res.json({ collections });
  }

  @SafeController
  static async create(req: Request, res: Response, _next: NextFunction) {
    const collectionData = req.body as CreationAttributes<Collection>;
    const collections = await Collection.create(collectionData);

    res.json({ collections });
  }

  @SafeController
  static async update(req: Request, res: LoadedCollectionResponse, _next: NextFunction) {
    const userData = req.body as CreationAttributes<Collection>;
    const users = await res.locals.collection.update(userData);

    res.json({ users });
  }

  @SafeController
  static async destroy(_req: Request, res: LoadedCollectionResponse, _next: NextFunction) {
    await res.locals.collection.destroy();

    res.status(NO_CONTENT).send();
  }
}

export default CollectionController;
