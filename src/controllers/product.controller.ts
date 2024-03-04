import { NextFunction, Request, Response } from 'express';
import { NO_CONTENT, NOT_FOUND } from 'http-status';
import { CreationAttributes } from 'sequelize';
import { SafeController } from '@/controllers/decorators';
import Product from '@/models/product';
import Collection from '@/models/collection';

type LoadedProductResponse<T = any> = Response<
  T,
  { product: Product; collection: Collection; [index: string]: unknown }
>;

class ProductController {
  @SafeController
  static async load(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params;

    const product = await Product.findByPk(productId);

    if (!product) throw res.status(NOT_FOUND).send();

    res.locals = { ...res.locals, product };
    next();
  }

  @SafeController
  static async show(_req: Request, res: LoadedProductResponse, _next: NextFunction) {
    res.json({ product: res.locals.product });
  }

  @SafeController
  static async list(_req: Request, res: Response, _next: NextFunction) {
    const products = await Product.findAll();

    res.json({ products });
  }

  @SafeController
  static async create(req: Request, res: Response, _next: NextFunction) {
    const productData = req.body as CreationAttributes<Product>;
    const { collectionId } = req.body;
    const collection = await Collection.findByPk(collectionId);

    if (!collection) throw res.status(NOT_FOUND).send('Collection not found');

    const products = await collection?.createProduct(productData);

    res.json({ products });
  }

  @SafeController
  static async update(req: Request, res: Response, _next: NextFunction) {
    const productData = req.body as CreationAttributes<Product>;
    const products = await res.locals.product.update(productData);

    res.json({ products });
  }
}

export default ProductController;
