import { NextFunction, Request, Response } from 'express';

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
