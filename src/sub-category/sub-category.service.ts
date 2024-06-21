import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) { }

  async findParentCategories(parentId: number) {
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

    if (parentCategories.length === 0) {
      throw new Error(`Parent category with ID ${parentId} does not exist.`);
    }

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
