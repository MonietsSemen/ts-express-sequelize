import { Locals, NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes, Op } from 'sequelize';
import { URLSearchParams } from 'url';
import { CreatePagination, SafeController, Pagination } from '@/controllers/decorators';
import Collection from '@/models/collection';
import Product from '@/models/product';
import env from '@/configs/env';

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
  @CreatePagination
  static async show(
    _req: Request,
    res: Response<
      any,
      {
        collection: Collection;
        pagination: Pagination;
        limitNumber: number;
        currentPageNumber: number;
      } & Record<string, any> &
        Locals
    >,
    _next: NextFunction,
  ) {
    const { collection, pagination, limitNumber, currentPageNumber } = res.locals;
    // filtration
    const { priceMin, priceMax } = _req.query;

    const priceMinNumber = parseInt(priceMin as string, 10) || undefined;
    const priceMaxNumber = parseInt(priceMax as string, 10) || undefined;

    const productsQuery: any = {
      where: {
        collectionId: collection.id,
      },
      limit: pagination.limit,
      offset: pagination.offset,
    };

    if (priceMinNumber || priceMaxNumber) {
      productsQuery.where.price = {
        [Op.between]: [priceMinNumber || 0, priceMaxNumber || 99999],
      };
    }

    const items = await Product.findAndCountAll(productsQuery);

    if (!items) throw res.status(NOT_FOUND).send('Products not found');

    const allPagesCount = Math.ceil(items.count / limitNumber > 1 ? items.count / limitNumber : 1);

    const createPaginationUrl = (nextPage: boolean) => {
      const url: any = new URL(`${env.domain}${_req.originalUrl}`);
      const params: any = new URLSearchParams();
      // if previous page - do not modified page number
      const modifierPageNumber: number = !nextPage ? 0 : 2;

      if (currentPageNumber < 1 && !nextPage) {
        return null;
      }

      if (currentPageNumber >= allPagesCount - 1 && nextPage) {
        return null;
      }

      params.append('page', `${currentPageNumber + modifierPageNumber}`);
      params.append('limit', `${pagination.limit || ''}`);
      url.search = params.toString();
      return url.toString();
    };

    const nextPageUrl = createPaginationUrl(true);
    const prevPageUrl = createPaginationUrl(false);
    const responseData = {
      collection: res.locals.collection,
      collectionProducts: items,
      pagination: {
        allProductsCount: items.count,
        currentPage: currentPageNumber + 1,
        allPages: allPagesCount,
        nextUrl: nextPageUrl,
        prevUrl: prevPageUrl,
      },
    };

    res.json(responseData);
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
