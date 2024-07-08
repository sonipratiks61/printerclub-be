// import { Injectable, NotFoundException } from '@nestjs/common';


import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderItemsDto } from './dto/create-order-Item.dto';
import { validate } from 'class-validator';

@Injectable()
export class OrderItemsService {
    constructor(private productService: ProductService,
        private prisma: PrismaService) {
    }
    async create(createOrderItemsDto: CreateOrderItemsDto[], ownerName: string) {
        const orderItemsData = await Promise.all(createOrderItemsDto.map(async (item) => {
            const {
                quantity,
                name,
                price,
                additionalDetails,
                productId,
                attributes,
                GSTNumber,
                discount,
                description,
            } = item;
            
           
            const product = await this.prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });

            if (!product) {
                throw new NotFoundException("Invalid Product Id");
            }

            // Map attributes to a format suitable for database creation
            const mappedAttributes = attributes.map(attr => ({
                name: attr.name,
                value: attr.value,
            }));

            return {
                quantity,
                name,
                price,
                additionalDetails,
                productId,
                GSTNumber,
                discount,
                ownerName,
description,
                attributes: {
                    create: mappedAttributes,
                }
            };
        }));
        const createdOrderItems = await this.prisma.orderItem.createMany({
            data: orderItemsData,
        });

        return createdOrderItems;
    }
    
  
    async findAll() {
        return await this.prisma.orderItem.findMany({
        include:{
        product:true
        }})
    }

    async findOne(id: number) {

        return await this.prisma.orderItem.findUnique({
            where: {
                id: id
            }
        })
    }
    async remove(id: number) {
        return await this.prisma.orderItem.delete({
            where: {
                id: id
            }
        })
    }
    // async update(id: number, createOrderItemDto: CreateOrderItemsDto) {
    //     const attributes = createOrderItemDto.attributes.map(attr => ({
    //         name: attr.name,
    //         value: attr.value,
    //     }));
    //     return await this.prisma.orderItem.update({
    //         where: {
    //             id: id
    //         },
    //         data: {
    //             quantity: createOrderItemDto.quantity,
    //             name: createOrderItemDto.name,
    //             price: createOrderItemDto.price,
    //             productId: createOrderItemDto.productId,
    //             attributes: {
    //                 set: attributes
    //             }

    //         }
    //     })
    // }
}
