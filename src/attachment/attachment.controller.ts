// attachments.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  Req,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Param,
  Get,
  NotFoundException,
  Delete,
} from '@nestjs/common';

import { AttachmentService } from './attachment.service';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiResponseInterface,
  ResponseInterface,
} from 'utils/response/interface';
import { FileUploadMiddleware } from 'utils/ImageUploadFunction/ImageUploadFunction';

@Controller('attachments')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(FileUploadMiddleware)
  async createAttachment(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
  ): Promise<ResponseInterface> {
    try {
      const userId = req.user.id;
      await this.attachmentService.create(files, userId);
      return { success: true, message: 'Uploaded Successfully' };
    } catch (error) {
      console.error('Error occurred while uploading files:', error);
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string): Promise<ApiResponseInterface<any>> {
    try {
      const attachmentId = parseInt(id);
      console.log(attachmentId);
      const attachment = await this.attachmentService.findOne(attachmentId);
      if (!attachment) {
        throw new NotFoundException('Invalid attachmentId');
      }
      return {
        success: true,
        message: 'Fetch Successfully ',
        data: attachment,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            success: false,
            message: error.message || 'There was a problem accessing data',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll() {
    try {
      return await this.attachmentService.findAllAttachment();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'There was a problem accessing data',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string): Promise<ResponseInterface> {
    try {
      const attachmentId = parseInt(id, 10);

      const attachment = await this.attachmentService.findOne(attachmentId);
      if (!attachment) {
        throw new NotFoundException('Invalid attachmentId');
      }
      await this.attachmentService.remove(attachmentId);
      return {
        success: true,
        message: 'Attachment deleted successfully',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            success: false,
            message: 'There was a problem accessing data',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
