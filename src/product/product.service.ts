import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CategoryService } from 'src/category/category.service';
import { SubCategoryService } from 'src/sub-category/sub-category.service';
import { WorkFlowService } from 'src/work-flow/work-flow.service';
import { AttachmentService } from 'src/attachment/attachment.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService,
    private categoryService: CategoryService,
    private workFlowService: WorkFlowService,
    private attachmentService: AttachmentService) { }

  async create(createProductDto: CreateProductDto, userId: number) {
    const categoryId = await this.categoryService.findOne(createProductDto.categoryId);
    if (!categoryId) {
      throw new NotFoundException('Invalid Category Id');
    }
    const workFlowId = await this.workFlowService.findOne(createProductDto.workflowId);
    if (!workFlowId) {
      throw new NotFoundException('Invalid WorkFlow Id');
    }
    let productData: any = {
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      userId: userId,
      gst:createProductDto.gst,
      discount:createProductDto.discount,
      categoryId: createProductDto.categoryId,
      workflowId: createProductDto.workflowId,
      isFitmentRequired: createProductDto.isFitmentRequired,
      isMeasurementRequired: createProductDto.isMeasurementRequired
    };

    const { type, min, max, options } = createProductDto.quantity;

    if (type === 'text') {
      if (min === undefined) {
        throw new BadRequestException('Minimum quantity must be provided  for text type');
      }
      productData = {
        ...productData,
        quantity: { type, min, max },

      };

    } else if (type === 'dropDown') {
      if (!options || !Array.isArray(options) || options.length === 0) {

        throw new BadRequestException('Dropdown value must be provided as an array of numbers for dropDown type');
      }
      productData = {
        ...productData,
        quantity: { type, options },
      };
    }

    const createdProduct = await this.prisma.product.create({
      data: productData,
      include: {
        category: {
          include: {
            subCategories: true,
          },
        },
      },
    });

    const isUploadFile = await this.prisma.attachmentAssociation.create({
      data: {
        relationId: createdProduct.id,
        relationType: 'product',
      },
    });

   for (const attachmentId of createProductDto.attachmentId) {
    const isCheckAttachment = await this.attachmentService.findOne(attachmentId);
    if (!isCheckAttachment) {
      throw new NotFoundException(`Attachment not found`);
    }
    await this.prisma.attachmentToAssociation.create({
      data: {
        attachmentId: attachmentId,
        attachmentAssociationId: isUploadFile.id,
      },
    });
  }
    return createdProduct;
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      where: {
        exclude: false,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
          },
        },
        attributes: true,
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  
    const attachmentAssociations = await this.prisma.attachmentAssociation.findMany({
      where: {
        relationType: 'product',
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
    const attachmentMap = attachmentAssociations.reduce((acc, item) => {
      acc[item.relationId] = item.attachments.map(attachment => ({
        id: attachment.attachment.id,
        fileName: attachment.attachment.fileName,
        filePath: attachment.attachment.filePath,
      }));
      return acc;
    }, {} as Record<number, { id: number; fileName: string; filePath: string }[]>);
  
    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        let parentCategory;
  
        if (product.category.parentId) {
          parentCategory = await this.categoryService.findOne(product.category.parentId);
        }
  
        return {
          id: product.id,
          categoryId: product.category.id,
          name: product.name,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
          gst:product.gst,
          discount:product.discount,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          userId: product.userId,
          workflowId: product.workflowId,
          isFitmentRequired: product.isFitmentRequired,
          isMeasurementRequired: product.isMeasurementRequired,
          category: {
            id: product.category.id,
            name: product.category.name,
            parentId: parentCategory?.id,
            parent: parentCategory?.name,
          },
          attachments: attachmentMap[product.id] || [],
          attributes: product.attributes.map((attribute) => ({
            id: attribute.id,
            productId: attribute.productId,
            attributeId: attribute.attributeId,
            type: attribute.type,
            ...(attribute.type==='dropDown'&&{ options: attribute.options})
          })),
          workflow: {
            id: product.workflow.id,
            name: product.workflow.name,
          },
        };
      })
    );
  
    return formattedProducts;
  }
  
  
  // async findOne(id: number) {
  //   return await this.prisma.product.findUnique({
  //     where: {
  //       id,
  //       exclude: false
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //       userId: true,
  //       categoryId: true,
  //       workflowId: true,
  //       description: true,
  //       quantity: true,
  //       attributes: true,
  //       isFitmentRequired: true,
  //       isMeasurementRequired: true,
  //       price: true,
  //       category: true,
  //       createdAt: true,
  //       updatedAt: true,
  //     }
  //   });
  // }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
          },
        },
        attributes: true,
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const attachmentAssociations = await this.prisma.attachmentAssociation.findMany({
      where: {
        relationId: id,
        relationType: 'product',
      },
      select: {
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
  
    const attachments = attachmentAssociations.flatMap(assoc => assoc.attachments.map(att => att.attachment));
  
    return {
      ...product,
      attachments: attachments || [],
    };
  }
  


  async findProductByCategoryId(categoryId: number, userId: number) {

    const userDetails = await this.prisma.user.findFirst({
      where: {
        id: userId
      },
      select: {
        role: true
      }
    })
    
    if (isNaN(categoryId) || categoryId <= 0) {
      throw new BadRequestException("Invalid category ID");
    }
    const category = await this.categoryService.findOne(categoryId);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    const data = await this.prisma.product.findMany({
      where: {
        categoryId: categoryId,
        exclude:false
      },
      include: {
        attributes: {
          include: {
            attribute: true,
          },
        },
      },
    });
    const attachmentAssociations = await this.prisma.attachmentAssociation.findMany({
      where: {
        relationType: 'product',
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
    const attachmentMap = attachmentAssociations.reduce((acc, item) => {
      acc[item.relationId] = item.attachments.map(attachment => ({
        id: attachment.attachment.id,
        fileName: attachment.attachment.fileName,
        filePath: attachment.attachment.filePath,
      }));
      return acc;
    }, {} as Record<number, { id: number; fileName: string; filePath: string }[]>);
  

    const transformedData = data.map(product => ({
      ...product,
      attachments: attachmentMap[product.id] || [],
      attributes: product.attributes.filter(item => item.attribute.showToUser || userDetails.role.id !== 2).map(attribute =>({
        id: attribute.id,
        productId: attribute.productId,
        name: attribute.attribute.name,
        type: attribute.type,
        ...(attribute.type === 'dropDown' && { options: attribute.options })
      })),
    }));
    return transformedData;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: updateProductDto.categoryId,
        },
      });
      if (!category) {
        throw new NotFoundException("Category not Found");
      }
    }
  
    if (updateProductDto.workFlowId) {
      const workFlow = await this.prisma.workFlow.findUnique({
        where: {
          id: updateProductDto.workFlowId,
        },
      });
      if (!workFlow) {
        throw new NotFoundException("WorkFlow not Found");
      }
    }
  
    let productData: any = {
      name: updateProductDto.name,
      description: updateProductDto.description,
      price: updateProductDto.price,
      categoryId: updateProductDto.categoryId,
      isMeasurementRequired: updateProductDto.isMeasurementRequired,
      isFitmentRequired: updateProductDto.isFitmentRequired
    };
  
    const { type, min, max, options } = updateProductDto.quantity;
  
    if (type === 'text') {
      if (min === undefined) {
        throw new BadRequestException('Minimum quantity must be provided for text type');
      }
      productData = {
        ...productData,
        quantity: { type, min, max },
      };
    } else if (type === 'dropDown') {
      if (!options || !Array.isArray(options) || options.length === 0) {
        throw new BadRequestException('Dropdown value must be provided as an array of numbers for dropDown type');
      }
      productData = {
        ...productData,
        quantity: { type, options },
      };
    }
  
    const updatedProduct = await this.prisma.product.update({
      where: {
        id: id,
      },
      data: productData,
    });
    if (updateProductDto.attachmentId && Array.isArray(updateProductDto.attachmentId)) {
      for (const attachmentId of updateProductDto.attachmentId) {
        const isCheckAttachment = await this.attachmentService.findOne(attachmentId);
        if (!isCheckAttachment) {
          throw new NotFoundException('Attachment not found');
        }
      }

      let attachmentAssociation = await this.prisma.attachmentAssociation.findFirst({
        where: {
          relationId: id,
          relationType: 'product',
        },
      });
  
      if (!attachmentAssociation) {
        attachmentAssociation = await this.prisma.attachmentAssociation.create({
          data: {
            relationId: id,
            relationType: 'product',
          },
        });
      }
  
      await this.prisma.attachmentToAssociation.deleteMany({
        where: {
          attachmentAssociationId: attachmentAssociation.id,
        },
      });
  
      for (const attachmentId of updateProductDto.attachmentId) {
        await this.prisma.attachmentToAssociation.create({
          data: {
            attachmentId,
            attachmentAssociationId: attachmentAssociation.id,
          },
        });
      }
    }
  
    return updatedProduct;
  }
  

  async remove(id: number) {
    await this.prisma.productAttribute.deleteMany({
      where: {
        productId: id,
      },
    });
    const data = this.prisma.product.update({
      where: { id: id }, data: {
        exclude: true
      }
    });
    return data;
  }
}
