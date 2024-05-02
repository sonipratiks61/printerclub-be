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
      destination: process.env.DESTINATION || './files',
      filename: (req, file, callback) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        callback(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 || parseInt(process.env.FILE_SIZE, 10),
      files: 5, // Maximum of 5 files per request
    },
    fileFilter: (req, file, cb) => {
      try {
        const fileExt = extname(file.originalname).toLowerCase(); //  for a mimeType
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        if (!allowedExtensions.includes(fileExt)) {
          throw new Error('Unsupported file type');
        }
        cb(null, true);
      } catch (error) {
        cb(error, false);
      }
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
