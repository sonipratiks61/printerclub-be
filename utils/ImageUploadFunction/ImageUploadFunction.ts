import { NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as multer from 'multer';
import { extname } from 'path';

export class FileUploadMiddleware implements NestMiddleware {
  private upload = multer({
    // storage: multer.memoryStorage(),
    // limits: {
    //   fileSize: 5 * 1024 * 1024,
    // },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, process.env.DESTINATION||'files/');
      },
      filename: (req, file, cb) => {

        return cb(null, `${file.fieldname}_${new Date().toISOString().replace(/[:-]/g, '').replace('T', '_').replace('Z', '_')}${file.originalname}`);

      },
    
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 || parseInt(process.env.FILE_SIZE, 10),
      files: 5, 
    },
  }).array('files', 5);
  use(req: Request, res: Response, next: NextFunction) {
    this.upload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        const message =
          err.code === 'LIMIT_FILE_SIZE'
            ? 'File size limit exceeded. Maximum file size is 5MB.'
            : 'Too many files uploaded. Maximum 5 files are allowed per request.';

        return next(
          new HttpException(
            { success: false, message },
            HttpStatus.BAD_REQUEST,
          ),
        );
      } else if (err) {
        return next(
          new HttpException(
            { success: false, message: err.message },
            HttpStatus.BAD_REQUEST,
          ),
        );
          }
      next();
    });
  }
}
