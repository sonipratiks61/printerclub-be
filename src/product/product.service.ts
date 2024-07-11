import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CategoryService } from 'src/category/category.service';
import { SubCategoryService } from 'src/sub-category/sub-category.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService) { }

  async create(createProductDto: CreateProductDto, userId: number) {
    const categoryId = await this.categoryService.findOne(createProductDto.categoryId);
    if (!categoryId) {
      throw new NotFoundException('Invalid Category Id');
    }
    let productData: any = {
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      userId: userId,
      categoryId: createProductDto.categoryId,
      isFitmentRequired: createProductDto.isFitmentRequired,
      isMeasurementRequired: createProductDto.isMeasurementRequired
    };

    const { type, min, max, options } = createProductDto.quantity;

    if (type === 'text') {
      if (min === undefined || max === undefined) {
        throw new BadRequestException('Both minimum and maximum quantity must be provided as a QuantityRange object for text type');
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

    return createdProduct;
  }

  async findAll() {
    const products= await this.prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            parentId: true,
          }
        },
        attributes: true
      }
    });

    const formattedProducts = await Promise.all(products.map(async product => {
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
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        userId: product.userId,
        isFitmentRequired: product.isFitmentRequired,
        isMeasurementRequired: product.isMeasurementRequired,
        category: {
          id: product.category.id,
          name: product.category.name,
          parentId: parentCategory.id,
          parent: parentCategory.name
          
        },
        attributes: product.attributes.map(attribute => ({
          id: attribute.id,
          productId: attribute.productId,
          name: attribute.name,
          type: attribute.type,
          options: attribute.options
        }))
      };
    }));
  
    return formattedProducts;
  }
  
  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findProductByCategoryId(categoryId: number) {
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
      },
      include: {
        attributes: true
      }
    });

    return data;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.categoryId) {
      const product = await this.prisma.category.findUnique({
        where: {
          id: updateProductDto.categoryId,
        },
      });

      if (!product) {
        throw new NotFoundException("Product Id Invalid");
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
      if (min === undefined || max === undefined) {
        throw new BadRequestException('Both minimum and maximum quantity must be provided as a QuantityRange object for text type');
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
    return this.prisma.product.update({
      where: {
        id: id,
      },
      data: productData,
    });
  }

  async remove(id: number) {
    await this.prisma.productAttribute.deleteMany({
      where: {
        productId: id,
      },
    });
    const data = this.prisma.product.delete({ where: { id } });
    return data;
  }
}
