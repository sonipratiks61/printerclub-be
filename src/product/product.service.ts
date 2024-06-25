import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService,
    private categoryService:CategoryService) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    const categoryId=await this.categoryService.findOne(createProductDto.categoryId);
if(!categoryId){
  throw new Error('Invalid Category Id') ;
}
    let productData: any = {
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      userId: userId,
      categoryId: createProductDto.categoryId,
      requiredFigment:createProductDto.isFitmentRequired ,
      requiredMeasurement:createProductDto.isMeasurementRequired 
    };

    const { type, min, max, options } = createProductDto.quantity;

    if (type === 'text') {
      if (min === undefined || max === undefined) {
        throw new BadRequestException('Both minimum and maximum quantity must be provided as a QuantityRange object for text type');
      }
      productData = {
        ...productData,
        quantity: { min, max },
        
      };
      
    } else if (type === 'dropDown') {
      if (!options || !Array.isArray(options) || options.length === 0) {
       
        throw new BadRequestException('Dropdown value must be provided as an array of numbers for dropDown type');
      }
      productData = {
        ...productData,
        quantity: options,
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
    return await this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }


  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.categoryId) {
      const product = await this.prisma.category.findUnique({
        where: {
          id: updateProductDto.categoryId,
        },
      });
  
      if (!product) {
        throw new Error(`Product with ID ${updateProductDto.categoryId} not found`);
      }
    }
    let productData: any = {
      name: updateProductDto.name,
      description: updateProductDto.description,
      price: updateProductDto.price,
      categoryId: updateProductDto.categoryId,
      isMeasurementRequired:updateProductDto.isMeasurementRequired,
      isFitmentRequired:updateProductDto.isFitmentRequired
    };
    const { type, min, max, options } = updateProductDto.quantity;

    if (type === 'text') {
      if (min === undefined || max === undefined) {
        throw new Error('Both minimum and maximum quantity must be provided as a QuantityRange object for text type');
      }
      productData = {
        ...productData,
        quantity: { min, max },
      };
    } else if (type === 'dropDown') {
      if (!options || !Array.isArray(options) || options.length === 0) {
        throw new Error('Dropdown value must be provided as an array of numbers for dropDown type');
      }
      productData = {
        ...productData,
        quantity: options,
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
    return this.prisma.product.delete({ where: { id } });
  }
}
