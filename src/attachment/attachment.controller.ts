// attachments.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  Req,
  UploadedFiles,
  Param,
  Get,
  NotFoundException,
  Delete,
  Res,
} from '@nestjs/common';

import { AttachmentService } from './attachment.service';
import { AuthGuard } from '@nestjs/passport';
import { FileUploadMiddleware } from 'utils/ImageUploadFunction/ImageUploadFunction';
import { ResponseService } from 'utils/response/customResponse';

@Controller('attachments')
export class AttachmentController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(FileUploadMiddleware)
  async createAttachment(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
    @Res() res,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      await this.attachmentService.create(files, userId);
      this.responseService.sendSuccess(res, 'upload successfully');
      return;
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        error.message || 'something went wrong',
        error,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Res() res): Promise<void> {
    try {
      const attachmentId = parseInt(id);
      console.log(attachmentId);
      const attachment = await this.attachmentService.findOne(attachmentId);
      if (!attachment) {
        this.responseService.sendNotFound(res, 'Invalid attachmentId');
      }
      this.responseService.sendSuccess(res, 'Fetch Successfully', attachment);
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
        return;
      } else {
        this.responseService.sendInternalError(
          res,
          error.message || 'something went wrong',
          error,
        );
        return;
      }
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll(@Res() res) {
    try {
      const data = await this.attachmentService.findAllAttachment();
      this.responseService.sendSuccess(res, 'Fetch All Data', data);
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        error.message || 'something went wrong',
        error,
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Res() res): Promise<void> {
    try {
      const attachmentId = parseInt(id, 10);

      const attachment = await this.attachmentService.findOne(attachmentId);
      if (!attachment) {
        this.responseService.sendNotFound(res, 'Invalid attachmentId');
        return;
      }
      await this.attachmentService.remove(attachmentId);
      this.responseService.sendSuccess(res, 'Attachment deleted successfully');
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
        return;
      } else {
        this.responseService.sendInternalError(
          res,
          error.message || 'something went wrong',
          error,
        );
        return;
      }
    }
  }
}
