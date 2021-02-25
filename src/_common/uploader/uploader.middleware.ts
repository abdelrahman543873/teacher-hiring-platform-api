import * as multer from 'multer';
import { Request, Response, NextFunction } from 'express';

export function restUploaderMiddleware(req: Request, res: Response, next: NextFunction) {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1000 * 1000 // 50 MG
    }
  }).any()(req, res, function (err) {
    if (err && err instanceof multer.MulterError)
      return next(Error(`Upload Error: ${err.message}`));
    return next();
  });
}
