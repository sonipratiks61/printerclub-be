import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';
import { CategoryType } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update.category.dto';
import { AttachmentService } from 'src/attachment/attachment.service';
@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService,
    private attachmentService: AttachmentService) { }
    
  async create(createCategoryDto: CreateCategoryDto, userId: number) {

    let message = 'Category created successfully';

    if (createCategoryDto.parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: createCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException("Invalid CategoryId");
      }

      message = 'Subcategory created successfully';
    }

    const isCheckAttachment = await this.attachmentService.findOne(createCategoryDto.attachmentId);

      if (!isCheckAttachment) {
        throw new NotFoundException("Attachment not found");
      }
    const parentId = createCategoryDto.parentId || null;
    const newCategory = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        type: createCategoryDto.type as CategoryType,
        parentId: parentId,
        userId: userId,
      },
    });

    let file = null;

    if (createCategoryDto.attachmentId) {
      const isUploadFile = await this.prisma.attachmentAssociation.create({
        data: {
          relationId: newCategory.id,
          relationType: 'category',
        },
      });

      const isCheckAttachment = await this.attachmentService.findOne(createCategoryDto.attachmentId);

      if (!isCheckAttachment) {
        throw new NotFoundException("Attachment not found");
      }

      await this.prisma.attachmentToAssociation.create({
        data: {
          attachmentId: createCategoryDto.attachmentId,
          attachmentAssociationId: isUploadFile.id,
        },
      });

      file = isCheckAttachment.filePath;
    }

    const data = {
      id: newCategory.id,
      name: newCategory.name,
      description: newCategory.description,
      type: newCategory.type,
      parentId: newCategory.parentId,
      userId: newCategory.userId,
      createdAt: newCategory.createdAt,
      updatedAt: newCategory.updatedAt,
      file: file,
    };

    return { data, message };
  }

  async findOne(id: number) {

    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const attachmentAssociation = await this.prisma.attachmentAssociation.findFirst({
      where: {
        relationId: id,
        relationType: 'category',
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // const attachmentAssociation = await this.prisma.attachmentAssociation.findFirst({
    //   where: {
    //     relationId: id,
    //     relationType: 'category',
    //   },
    // });
    let attachment = null;
    if (attachmentAssociation) {
      attachment = await this.prisma.attachment.findUnique({
        where: {
          id: attachmentAssociation.id,
        },
        select: { id: true, fileName: true, filePath: true }
      });
    }

    return {
      ...category,
      attachment: attachment ? attachment : null,
    };
  }


  async findAll(includeSubCategory: boolean) {
    if (includeSubCategory) {
      const data = await this.prisma.category.findMany({
        where: {
          parentId: null,
        },
        include: {
          subCategories: {
            select: {
              id: true,
              name: true,
              parentId: true,
              type: true,
              description: true,
            },
          },
        },
      });
  
      const attachment = await this.prisma.attachmentAssociation.findMany({
        where: {
          relationType: 'category',
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
      });
  
      // Map the first attachment for each categoryId
      const attachmentMap = attachment.reduce((acc, item) => {
        if (item.attachments.length > 0) {
          acc[item.relationId] = {
            id: item.attachments[0].attachment.id,
            fileName: item.attachments[0].attachment.fileName,
            filePath: item.attachments[0].attachment.filePath,
          };
        }
        return acc;
      }, {} as Record<number, { id: number; fileName: string; filePath: string } | null>);
  
      const products = await this.prisma.product.findMany({
        where: {
          exclude: false,
        },
      });
  
      const productCategoryIds = products.map((product) => product.categoryId);
  
      const formatted = data.flatMap((category) => [
        {
          id: category.id,
          name: category.name,
          parentId: category.parentId,
          type: category.type,
          description: category.description,
          isDeletable: category.subCategories.length !== 0,
          attachment: attachmentMap[category.id] || null,
        },
        ...category.subCategories.map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          parent: category.name,
          parentId: subCategory.parentId,
          type: subCategory.type,
          description: subCategory.description,
          isDeletable: productCategoryIds.includes(subCategory.id),
          attachment: attachmentMap[subCategory.id] || null,
        })),
      ]);
  
      return formatted;
  
    }
  
    const data = await this.prisma.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        parentId: true,
        type: true,
        description: true,
      },
    });
  
    const attachment = await this.prisma.attachmentAssociation.findMany({
      where: {
        relationType: 'category',
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
    });
  
    // Map the first attachment for each categoryId
    const attachmentMap = attachment.reduce((acc, item) => {
      if (item.attachments.length > 0) {
        acc[item.relationId] = {
          id: item.attachments[0].attachment.id,
          fileName: item.attachments[0].attachment.fileName,
          filePath: item.attachments[0].attachment.filePath,
        };
      }
      return acc;
    }, {} as Record<number, { id: number; fileName: string; filePath: string } | null>);
  
    const formatted = data.map((category) => ({
      id: category.id,
      name: category.name,
      parentId: category.parentId,
      type: category.type,
      description: category.description,
      attachment: attachmentMap[category.id] || null, // Attach single attachment object or null
    }));
  
    return formatted;
  }
  
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: updateCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException(`Parent category with ID ${updateCategoryDto.parentId} not found`);
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id: id },
      data: {
        name: updateCategoryDto.name,
        description: updateCategoryDto.description,
        type: updateCategoryDto.type as CategoryType,
        parentId: updateCategoryDto.parentId,
      },
    });

    if (updateCategoryDto.attachmentId) {
      const isCheckAttachment = await this.attachmentService.findOne(updateCategoryDto.attachmentId);
      if (!isCheckAttachment) {
        throw new NotFoundException("Attachment not found");
      }

      const existingAttachmentAssociation = await this.prisma.attachmentAssociation.findFirst({
        where: {
          relationId: id,
          relationType: 'category',
        },
      });

      if (existingAttachmentAssociation) {
        await this.prisma.attachmentToAssociation.updateMany({
          where: {
            attachmentAssociationId: existingAttachmentAssociation.id,
          },
          data: {
            attachmentId: updateCategoryDto.attachmentId,
          },
        });
      } else {
        const newAttachmentAssociation = await this.prisma.attachmentAssociation.create({
          data: {
            relationId: id,
            relationType: 'category',
          },
        });

        await this.prisma.attachmentToAssociation.create({
          data: {
            attachmentId: updateCategoryDto.attachmentId,
            attachmentAssociationId: newAttachmentAssociation.id,
          },
        });
      }
    }
    return updatedCategory;
  }

  async remove(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
