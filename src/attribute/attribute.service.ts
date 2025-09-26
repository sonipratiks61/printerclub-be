import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttributeDto } from './dto/attribute.dto';

@Injectable()
export class AttributeService {
  constructor(private prisma: PrismaService) { }

  async create(createAttributeDto: CreateAttributeDto) {
    const existingOrderHistory = await this.prisma.attribute.findFirst({
      where: {
          name: createAttributeDto.name,
      },
  });
    if (existingOrderHistory) {
      throw new ConflictException("Attribute Name should be Unique")
    }
else{
    const data = await this.prisma.attribute.create({
      data: {
        name: createAttributeDto.name,
        showToUser: createAttributeDto.showToUser
      }

    })
    return data;
  }
   
  }

  async findOne(id: number) {
    return await this.prisma.attribute.findUnique({
      where: {
        id: id
      }
    })
  }

  async findAllAttribute(search: string) {
    return this.prisma.attribute.findMany({
      where: {
        name: search ? { contains: search } : undefined
      },
      select: {
        id: true,
        name: true,
        showToUser: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }


  async update(id: number, createAttributeDto: CreateAttributeDto) {
    return await this.prisma.attribute.update({
      where: {
        id: id
      },
      data: {
        name: createAttributeDto.name,
        showToUser: createAttributeDto.showToUser
      }
    })
  }


  async delete(id: number) {
    return await this.prisma.attribute.delete({
      where: {
        id: id
      },
    })
  }
}
