import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status';
import env from '@/configs/env';

export const notFound = (req: Request, res: Response) => {
  res.status(NOT_FOUND).json({ message: 'Invalid path' });
};

type SequelizeValidationError = {
  name: 'SequelizeValidationError' | 'SequelizeUniqueConstraintError';
  errors: [
    {
      path: string;
      message: string;
    },
  ];
};

const databaseErrors = ['SequelizeValidationError', 'SequelizeUniqueConstraintError'];

/**
 * Handle database errors
 */
const handleDatabaseError = (err: SequelizeValidationError) => {
  return (err as SequelizeValidationError).errors.reduce(
    (acc, error) => ({ ...acc, [error.path]: error.message }),
    {},
  );
};

export const httpError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (databaseErrors.includes(err.name)) {
    const errors = handleDatabaseError(err);
    return res.status(BAD_REQUEST).json({ name: err.name, errors });
  }

  if (err.name === 'UnauthorizedError') {
    const message = err.message === 'jwt expired' ? 'Token has been expired' : 'Invalid token';
    return res.status(UNAUTHORIZED).json({ message });
  }

  return next(err);
};

const otherError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.isOperational) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json(err);
    return;
  }

  const response = {
    status: err.status,
    message: err.message,
    name: err.name,
    errors: err.index,
    stack: err.stack,
  };

  if (env.nodeEnv !== 'development') delete response.stack;
  res.status(response.status).json(response);
};

export default [notFound, httpError, otherError];
