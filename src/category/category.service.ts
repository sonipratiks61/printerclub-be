import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateCategoryDto, userId: number): Promise<void> {
    try {
      await this.prisma.category.create({
        data: {
          name: user.name,
          description: user.description,
          userId: userId,
        },
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        userId: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id: id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
