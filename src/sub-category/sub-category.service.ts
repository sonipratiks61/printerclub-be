import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) { }

  async findParentCategories(parentId: number) {
    const parent = await this.prisma.category.findFirst({
      where: {
        parentId: parentId,
      },
    });
  
    if(!parent)
    {
      throw new Error("Invalid ParentId")
    }
    const parentCategories = await this.prisma.category.findMany({
      where: {
        OR: [
          { id: parentId },
          { subCategories: { some: { parentId: parentId } } },
        ],
      },
      select: {
        subCategories: {
          select: {
            id: true,
            name: true,
            parentId: true,
            description: true,
          },
        },
      },
    });

    const formattedCategories = parentCategories.flatMap((category) =>
      category.subCategories.map((subCategory) => ({
        id: subCategory.id,
        name: subCategory.name,
        parentId: subCategory.parentId,
        description: subCategory.description,
      })),
    );
    return formattedCategories;
  }
}
