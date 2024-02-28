import { NextFunction, Request, Response } from 'express';
import { URLSearchParams } from 'url';
import env from '../configs/env';

/** Wrap express middleware with error handles and send error to error-handler  */
export function SafeController(controllerMethod: any, context: ClassMethodDecoratorContext) {
  return async function wrapper(this: any, ...args: [Request, Response, NextFunction]) {
    const [req, res, next] = args;
    try {
      return await controllerMethod.call(this, req, res, next);
    } catch (e) {
      next(e);
    }
  };
}

export type Pagination = Record<'limit' | 'offset', number>;

export function CreatePagination(controllerMethod: any, context: ClassMethodDecoratorContext) {
  return async function wrapper(this: any, ...args: [Request, Response, NextFunction]) {
    const [req, res, next] = args;
    try {
      const { page, limit } = req.query;
      const defaultLimit = 50;
      const defaultOffsetNumber = 0;
      const limitNumber: number = parseInt(limit as string, 10) || defaultLimit;
      const currentPageNumber: number = parseInt(page as string, 10) - 1 || defaultOffsetNumber;
      const pagination: Pagination = {
        limit: limitNumber,
        offset: currentPageNumber * limitNumber,
      };

      res.locals = { ...res.locals, pagination, limitNumber, currentPageNumber };

      return await controllerMethod.call(this, req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
