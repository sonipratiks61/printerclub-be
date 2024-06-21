import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductAttributesDto } from './dto/productAttributes.dto';
import { AttributeType } from '@prisma/client';
import { UpdateProductAttributesDto } from './dto/updateProductAttributes.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ProductAttributesService {
  constructor(private prisma: PrismaService,
    private productService:ProductService ) {}

  async create(createProductAttributesDto: CreateProductAttributesDto) {
    const product=await this.productService.findOne(createProductAttributesDto.productId);
    if(!product){
      throw new Error('Invalid Product Id');
    }
    const createdProduct = await this.prisma.productAttribute.create({
      data: {
        name: createProductAttributesDto.name,
        type: createProductAttributesDto.type as AttributeType,
        optional: createProductAttributesDto.optional,
        productId: createProductAttributesDto.productId
      },
    });
    return createdProduct;
  }

  async findAll() {
    return await this.prisma.productAttribute.findMany({
      include: {
        product: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.productAttribute.findUnique({
      where: { id },
    });
  }
  
  async update(id: number, updateProductAttributeDto: UpdateProductAttributesDto) {
    if (updateProductAttributeDto.productId) {
      const product = await this.prisma.product.findUnique({
        where: {
          id: updateProductAttributeDto.productId,
        },
      });
  
      if (!product) {
        throw new Error(`Product with ID ${updateProductAttributeDto.productId} not found`);
      }
    }
    return this.prisma.productAttribute.update({
      where: {
        id: id,
      },
      data: {
        name: updateProductAttributeDto.name,
        type: updateProductAttributeDto.type as AttributeType,
        productId: updateProductAttributeDto.productId,
        optional: updateProductAttributeDto.optional,
      },
    });
  }
  async remove(id: number) { 
    return this.prisma.product.delete({ where: { id } });
  }
}
