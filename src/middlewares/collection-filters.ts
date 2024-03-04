import { Request, Response, NextFunction } from 'express';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';
import { SafeController } from '@/controllers/decorators';

export type Filters = {
  dateFilter?: {
    [Op.between]: [string, string];
  };
  priceFilter?: {
    [Op.between]: [number, number];
  };
};

export default class CollectionFilters {
  @SafeController
  static async filterByDate(req: Request, res: Response, next: NextFunction) {
    const { dateStart, dateEnd } = req.query;
    const currentFilters = res.locals.filters || {};

    if (dateStart || dateEnd) {
      const objectDateStart =
        typeof dateStart === 'string'
          ? DateTime.fromISO(dateStart).toUTC()
          : DateTime.fromISO('1990-01-01').toUTC();
      const objectDateEnd =
        typeof dateEnd === 'string' ? DateTime.fromISO(dateEnd) : DateTime.now().toUTC();
      currentFilters.dateFilter = {
        [Op.between]: [objectDateStart?.toString(), objectDateEnd?.toString()],
      };

      res.locals = { ...res.locals, filters: currentFilters };
    }

    next();
  }

  @SafeController
  static async filterByPrice(req: Request, res: Response, next: NextFunction) {
    const { priceMin, priceMax } = req.query;
    const currentFilters = res.locals.filters || {};
    const priceMinNumber = parseInt(priceMin as string, 10) || undefined;
    const priceMaxNumber = parseInt(priceMax as string, 10) || undefined;

    if (priceMinNumber || priceMaxNumber) {
      currentFilters.priceFilter = { [Op.between]: [priceMinNumber || 0, priceMaxNumber || 99999] };
      res.locals = { ...res.locals, filters: currentFilters };
    }

    next();
  }
}
