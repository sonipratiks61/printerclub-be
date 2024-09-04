// attachments.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttachmentService {
  constructor(private prisma: PrismaService) { }

  async create(files: Express.Multer.File[], userId: number) {
  
      if (files.length === 0) {
        throw new BadRequestException('Please upload at least 1 file.');
      }
  
      const attachmentData = files.map(file => ({
        fileName: file.originalname,
        filePath: file.path,
        attachmentType: file.mimetype,
        userId: userId,
      }));
      const data = await this.prisma.attachment.createMany({
        data: attachmentData,
      });
      return data;
   
  }
  
  async findAll() {
    return await this.prisma.attachment.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.attachment.findUnique({
      where: {
        id: id,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.attachment.delete({
      where: {
        id,
      },
    });
  }

  async findAllAttachment() {
    return this.prisma.attachment.findMany({
      select: {
        id: true,
        filePath: true,
        fileName: true,
        attachmentType: true,
        userId: true,
      },
    });
  }
}
