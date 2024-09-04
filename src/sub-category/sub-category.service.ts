import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) { }

  async findOneSubCategory(parentId:number)
  {
    return await this.prisma.category.findFirst({
      where: {
        parentId: parentId,
      },
    });
    
  }
  async searchSubCategories(parentId: number) {
   
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
  
  
    const attachments = await this.prisma.attachmentAssociation.findMany({
      where: {
        relationType: 'category',
        relationId: {
          in: parentCategories.flatMap((category) =>
            category.subCategories.map((subCategory) => subCategory.id),
          ),
        },
      },
        select: {
          relationId: true,
          attachments: {
            select: {
              attachment: {
                select: {
                  id: true,
                  fileName: true,
                  filePath: true,
                },
              },
            },
          },
        },
      },
    );
  
  
    const attachmentMap = attachments.reduce((map, attachment) => {
      const categoryId = attachment.relationId;
      if (!map[categoryId] && attachment.attachments.length > 0) {
        
        map[categoryId] = attachment.attachments[0].attachment;
      }
      return map;
    }, {});
  
   const formattedCategories = parentCategories.flatMap((category) =>
      category.subCategories.map((subCategory) => ({
        id: subCategory.id,
        name: subCategory.name,
        parentId: subCategory.parentId,
        description: subCategory.description,
        attachment: attachmentMap[subCategory.id] || null, 
        })),
    );
    return formattedCategories;
  }
}
