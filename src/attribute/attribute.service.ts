import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttributeService {
  constructor(private prisma: PrismaService) {}

  async findAllAttribute() {
    return this.prisma.attribute.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
