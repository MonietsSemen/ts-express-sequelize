import { Request, Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';
import { SafeController } from '@/controllers/decorators';

export class CollectionFilters {
  @SafeController
  static async filterByDate(req: Request, res: Response, next: NextFunction) {
    const { dateStart, dateEnd } = req.query;

    if (dateStart || dateEnd) {
      const objectDateStart =
        typeof dateStart === 'string'
          ? DateTime.fromISO(dateStart).toUTC()
          : DateTime.fromISO('1990-01-01').toUTC();
      const objectDateEnd =
        typeof dateEnd === 'string' ? DateTime.fromISO(dateEnd) : DateTime.now().toUTC();
      // eslint-disable-next-line no-param-reassign
      const dateFilter = { [Op.between]: [objectDateStart?.toString(), objectDateEnd?.toString()] };

      res.locals = { ...res.locals, dateFilter };
    }

    next();
  }

  @SafeController
  static async filterByPrice(req: Request, res: Response, next: NextFunction) {
    const { priceMin, priceMax } = req.query;
    const priceMinNumber = parseInt(priceMin as string, 10) || undefined;
    const priceMaxNumber = parseInt(priceMax as string, 10) || undefined;

    if (priceMinNumber || priceMaxNumber) {
      // eslint-disable-next-line no-param-reassign
      const priceFilter = { [Op.between]: [priceMinNumber || 0, priceMaxNumber || 99999]};
      res.locals = { ...res.locals, priceFilter };
    }

    next();
  }
}
