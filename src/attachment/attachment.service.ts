// attachments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttachmentService {
  constructor(private prisma: PrismaService) {}

  async create(files: Express.Multer.File[], userId: number) {
    try {
      if (files.length === 0) {
        throw new Error('Please upload at least 1 file.');
      }
      for (const file of files) {
        await this.prisma.attachment.create({
          data: {
            path: file.path,
            attachmentType: file.mimetype,
            userId: userId,
          },
        });
      }
    } catch (error) {
      console.error('Error creating attachments:', error);
      throw error;
    }
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
        path: true,
        attachmentType: true,
        userId: true,
      },
    });
  }
}
