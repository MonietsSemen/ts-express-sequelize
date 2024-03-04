import { NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes, Op } from 'sequelize';
import { URLSearchParams } from 'url';
import { CreatePagination, SafeController, Pagination } from '@/controllers/decorators';
import Collection from '@/models/collection';
import Product from '@/models/product';
import { Filters } from '@/middlewares/collection-filters';
import env from '@/configs/env';

type LoadedCollectionResponse<T = any> = Response<
  T,
  { collection: Collection; pagination: Pagination; [index: string]: unknown }
>;

type ShowCollectionResponse<T = any> = Response<
  T,
  { collection: Collection; pagination: Pagination; filters: Filters; [index: string]: unknown }
>;

class CollectionController {
  @SafeController
  static async load(req: Request, res: Response, next: NextFunction) {
    const { collectionId } = req.params;
    const collection = await Collection.findByPk(collectionId);

    if (!collection) throw res.status(NOT_FOUND).json({ message: 'Collections not found' });

    res.locals = { ...res.locals, collection };
    next();
  }

  @SafeController
  @CreatePagination
  static async show(req: Request, res: ShowCollectionResponse, _next: NextFunction) {
    const { collection, pagination, filters } = res.locals;

    const currentPageNumber = pagination.offset / pagination.limit;
    const productsQuery: any = {
      where: {
        collectionId: collection.id,
      },
      limit: pagination.limit,
      offset: pagination.offset,
    };

    if (filters?.priceFilter !== undefined) productsQuery.where.price = filters.priceFilter;
    if (filters?.dateFilter !== undefined) productsQuery.where.createdAt = filters.dateFilter;

    const items = await Product.findAndCountAll(productsQuery);

    if (!items) throw res.status(NOT_FOUND).json({ message: 'Products not found' });

    const allPagesCount = Math.ceil(
      items.count / pagination.limit > 1 ? items.count / pagination.limit : 1,
    );

    const pagesUrl = CollectionController.createPaginationUrls(
      pagination.limit,
      currentPageNumber,
      req.originalUrl,
      allPagesCount,
    );

    const responseData = {
      collection: res.locals.collection,
      collectionProducts: items,
      pagination: {
        allProductsCount: items.count,
        currentPage: currentPageNumber + 1,
        allPages: allPagesCount,
        nextUrl: pagesUrl.nextPage,
        prevUrl: pagesUrl.prevPage,
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

  static createPaginationUrls = (
    paginationLimit: number,
    currentPage: number,
    originalUrl: string,
    allPagesCount: number,
  ) => {
    type PaginationUrls = {
      nextPage: string | null;
      prevPage: string | null;
    };

    const nextPageArr = [true, false];
    const paginationUrls = { nextPage: '', prevPage: '' };
    nextPageArr.forEach((nextPage) => {
      const url: any = new URL(`${env.domain}${originalUrl}`);
      const params: any = new URLSearchParams();
      // if previous page - do not modified page number
      const modifierPageNumber: number = !nextPage ? 0 : 2;

      if (currentPage < 1 && !nextPage) return;

      if (currentPage >= allPagesCount - 1 && nextPage) return;

      params.append('page', `${currentPage + modifierPageNumber}`);
      params.append('limit', `${paginationLimit || ''}`);
      url.search = params.toString();
      paginationUrls.nextPage = nextPage ? url.toString() : paginationUrls.nextPage;
      paginationUrls.prevPage = !nextPage ? url.toString() : paginationUrls.prevPage;
    });

    return paginationUrls;
  };
}

export default CollectionController;
