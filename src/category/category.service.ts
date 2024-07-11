import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';
import { CategoryType } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update.category.dto';
@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    try {
      let message = 'Category created successfully';
  
      if (createCategoryDto.parentId) {
        const parentCategory = await this.prisma.category.findUnique({
          where: {
            id: createCategoryDto.parentId,
          },
        });

        if (!parentCategory) {
          throw new NotFoundException(
            "Invalid CategoryId"
          );
        }
  
        message = 'Subcategory created successfully';
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
      const data = {
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        type: newCategory.type,
        parentId: newCategory.parentId,
        userId: newCategory.userId,
        createdAt: newCategory.createdAt,
        updatedAt: newCategory.updatedAt,
      }
      return { data, message };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error; 
    }
  }

  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }


    async findAll(includeSubCategory: boolean) {
      if (includeSubCategory) {
        const data = await this.prisma.category.findMany({
          where: {
           parentId: null },
      
          include: {
            subCategories: {
              select: {
                id: true,
                name: true,
                parentId: true,
                type: true,
                description: true
              }
            }
          }
        });
    

      const formatted = data.flatMap(category => [
        {
          id: category.id,
          name: category.name,
          parentId: category.parentId,
          type: category.type,
          description: category.description,
        },
        ...category.subCategories.map(subCategory => ({
          id: subCategory.id,
          name: subCategory.name,
          parent: category.name,
          parentId: subCategory.parentId,
          type: subCategory.type,
          description: subCategory.description,
        }))
      ])

      return formatted
    }
    else {
      return this.prisma.category.findMany(
        {
          where: {
            parent: null
          },
          select: {
            id: true,
            name: true,
            parentId: true,
            type: true,
            description: true
          }
        });
    }
  }
            
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: {
          id: updateCategoryDto.parentId,
        },
      });

      if (!parentCategory) {
        throw new NotFoundException(
          'Invalid Category Id',
        );
      }

    }

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
