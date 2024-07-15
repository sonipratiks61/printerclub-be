import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseService {
  private readonly responseCodes = {
    success: HttpStatus.OK,
    createSuccessfully: HttpStatus.CREATED,
    badRequest: HttpStatus.BAD_REQUEST,
    authenticationFailed: HttpStatus.UNAUTHORIZED,
    notFound: HttpStatus.NOT_FOUND,
    internalError: HttpStatus.INTERNAL_SERVER_ERROR,
    conflict:HttpStatus.CONFLICT
  };

  private sendResponse(
    res: Response,
    resCode: number,
    message: string,
    data: any = {},
    error: any = null,
  ) {
    res.status(resCode).json({
      success: resCode <= HttpStatus.CREATED,
      data,
      message,
      error,
    });
  }

  sendSuccess(res: Response, message: string, data: any = {}) {
    this.sendResponse(res, this.responseCodes.success, message, data);
  }

  sendCreateObject(res: Response, message: string) {
    this.sendResponse(res, this.responseCodes.createSuccessfully, message);
  }

  sendBadRequest(res: Response, message: string, error: any = {}) {
    this.sendResponse(res, this.responseCodes.badRequest, message, {}, error);
  }


  sendConflict(res: Response, message: string, error: any = {}) {
    this.sendResponse(res, this.responseCodes.conflict, message, {}, error);
  }
  
  sendAuthenticationFailed(res: Response, message: string, error: any = {}) {
    this.sendResponse(
      res,
      this.responseCodes.authenticationFailed,
      message,
      {},
      error,
    );
  }

  sendNotFound(res: Response, message: string, error: any = {}) {
    this.sendResponse(
      res,
      this.responseCodes.notFound,
      message,

      {},
      error,
    );
  }

  sendInternalError(res: Response, message: string, error: any = {}) {
    this.sendResponse(
      res,
      this.responseCodes.internalError,
      message,
      {},
      error,
    );
  }
}
