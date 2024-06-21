import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';
import { CategoryType } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update.category.dto';
@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    try {
      if (createCategoryDto.parentId) {
        const parentCategory = await this.prisma.category.findUnique({
          where: {
            id: createCategoryDto.parentId,
          },
        });

        if (!parentCategory) {
          throw new Error(
            `Parent category with ID ${createCategoryDto.parentId} not found`,
          );
        }
      }
      const parentId = createCategoryDto.parentId
        ? createCategoryDto.parentId
        : null;
      const newCategory = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          description: createCategoryDto.description,
          type: createCategoryDto.type as CategoryType,
          parentId: parentId,
          userId: userId,
        },
      });
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error; // Re-throw the error or handle it accordingly
    }
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: {
        parentId: null,  
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        createdAt: true,
        attachmentAssociations: true,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: updateCategoryDto.name,
        description: updateCategoryDto.description,
        type: updateCategoryDto.type as CategoryType,
        parentId: updateCategoryDto.parentId,
      },
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
