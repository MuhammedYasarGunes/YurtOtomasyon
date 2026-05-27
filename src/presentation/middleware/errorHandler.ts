/**
 * Centralized Express error handler
 */
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../config/constants.js';

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction): void {
  const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const responseBody = {
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
  };

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json(responseBody);
}
