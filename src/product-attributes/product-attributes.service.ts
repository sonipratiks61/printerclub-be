import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductAttributesDto } from './dto/productAttributes.dto';
import { AttributeType } from '@prisma/client';
import { UpdateProductAttributesDto } from './dto/updateProductAttributes.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ProductAttributesService {
  constructor(private prisma: PrismaService,
    private productService: ProductService) { }

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

      if (!dto.attributeId || !dto.productId || !dto.type) {
        throw new BadRequestException("All fields are Required")
      }

      let data: any = {
        attributeId: dto.attributeId,
        type: dto.type,
        productId: dto.productId,
        price: dto.price
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
    const productId = updateProductAttributeDto.productId
    const product = await this.productService.findOne(productId);

    if (!product) {
      throw new BadRequestException("Product Invalid");
    }

    let updateProductAttributeData: any = {
      attributeId: updateProductAttributeDto.attributeId,
      type: updateProductAttributeDto.type as AttributeType,
      productId: updateProductAttributeDto.productId,
      price: updateProductAttributeDto.price
    };

    if (updateProductAttributeDto.type === 'dropDown') {
      if (!updateProductAttributeDto.options || updateProductAttributeDto.options.length === 0) {
        throw new BadRequestException('Options must be provided for dropDown type');
      }

      updateProductAttributeData.options = updateProductAttributeDto.options;

    }
    else {
      updateProductAttributeData.options = null;
    }
    const data = await this.prisma.productAttribute.update({
      where: {
        id: id,
      },
      data: {
        ...updateProductAttributeData,
        options: updateProductAttributeData.options,

      },
    });
    if (data.type === 'dropDown') {
      return data;
    }
    else {
      return {
        id: id,
        name: data.attributeId,
        type: data.type,
        productId: data.productId,
      };
    }

  }


  async remove(id: number) {
    return this.prisma.productAttribute.delete({ where: { id } });
  }
}
