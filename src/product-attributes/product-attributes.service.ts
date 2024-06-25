import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductAttributesDto } from './dto/productAttributes.dto';
import { AttributeType } from '@prisma/client';
import { UpdateProductAttributesDto } from './dto/updateProductAttributes.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ProductAttributesService {
  constructor(private prisma: PrismaService) { }

  async createMany(createProductAttributesDto: CreateProductAttributesDto[]) {
    const productIds = createProductAttributesDto.map(dto => dto.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const existingProductIds = products.map(product => product.id);

    const nonExistentProductIds = productIds.filter(id => !existingProductIds.includes(id));

    if (nonExistentProductIds.length > 0) {
      throw new NotFoundException("One of the Product does not exist");
    }

    const createData = createProductAttributesDto.map(dto => {

      if (!dto.name || !dto.productId || !dto.type) {
        throw new BadRequestException("All fields are Required")
      }

      let data: any = {
        name: dto.name,
        type: dto.type,
        productId: dto.productId,
      };

      if (dto.type === 'dropDown') {
        if (!dto.options || dto.options.length === 0) {
          throw new BadRequestException('Options must be provided for dropDown type');
        }
        data.options = dto.options;
      } 

      return data;
    });

    return this.prisma.productAttribute.createMany({
      data: createData,
    });
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
        throw new BadRequestException(`Product with ID ${updateProductAttributeDto.productId} not found`);
      }
    }

    let updateProductAttributeData: any = {
      name: updateProductAttributeDto.name,
      type: updateProductAttributeDto.type as AttributeType,
      productId: updateProductAttributeDto.productId,
    };

    if (updateProductAttributeDto.type === 'dropDown') {
      if (!updateProductAttributeDto.options || updateProductAttributeDto.options.length === 0) {
        throw new BadRequestException('Options must be provided for dropDown type');
      }

      updateProductAttributeData.options = updateProductAttributeDto.options;
    } else if (updateProductAttributeDto.type === 'text') {

      if (updateProductAttributeDto.options && updateProductAttributeDto.options.length > 0) {

        throw new BadRequestException('Options should not be provided for text type');
      }
    }
    return this.prisma.productAttribute.update({
      where: {
        id: id,
      },
      data: {
        ...updateProductAttributeData,
        options: updateProductAttributeData.options,

      },
    });


  }
  async remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
