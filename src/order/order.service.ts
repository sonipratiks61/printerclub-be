import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CustomerDetailsService } from 'src/customer-details/customer-details.service';
import { CreateOrderItemsDto } from 'src/order-items/dto/create-order-Item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDetailsDto } from 'src/customer-details/dto/customer-details.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService,
    private productService: ProductService) { }

  async create(createOrderDto: CreateOrderDto, ownerName: string) {
    const { advancePayment, remainingPayment, totalPayment, paymentMode, orderItems, customerDetails } = createOrderDto;
    const productIds = [...new Set(orderItems.map(item => item.productId))];

    for (const productId of productIds) {
      const product = await this.productService.findOne(productId);
      if (!product) {
        throw new NotFoundException("One of the Product does not exist");
      }
    }
    const createdOrder = await this.prisma.order.create({
      data: {
        advancePayment,
        remainingPayment,
        totalPayment,
        paymentMode,
        ownerName,
        customerDetails: {
          create: customerDetails
        },
        orderItems: {
          createMany: {
            data: orderItems.map((item: CreateOrderItemsDto) => ({
              quantity: item.quantity,
              name: item.name,
              price: item.price,
              additionalDetails: item.additionalDetails,
              productId: item.productId,
              gst: item.gst,
              address: item.address,
              measurement: item.measurement,
              discount: item.discount,
              ownerName,
              description: item.description,
              attributes: item.attributes?.map(attr => ({
                name: attr.name,
                value: attr.value,
              })),

            })),
          },
        },
        orderHistory:{
          create: {
          status: "Pending",
          ownerName:ownerName
          }
        }
      },
      include: {
        orderItems: true,
        customerDetails: true,
        orderHistory: true

      },
    });
    return createdOrder;

  }

  async findAll() {
   const orders= await this.prisma.order.findMany({
      include: {
        orderItems: {
          select: {
            id: true,
            quantity: true,
            name: true,
            price: true,
            additionalDetails: true,
            productId: true,
            gst: true,
            address: true,
            measurement: true,
            discount: true,
            description: true,
            attributes: true,
            ownerName: true,

          }
        },
        customerDetails:
        {
          select: {
            id: true,
            name: true,
            email: true,
            mobileNumber: true,
            additionalDetails: true
          }

        },
        orderHistory: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1,
          select: {
            id: true,
            status: true,
            ownerName: true,
            timestamp: true,

          }
        }
      }
    })
    const formattedOrders = orders.map(order => ({
     id: order.id,
     orderItems: order.orderItems,
     customerDetails: order.customerDetails[0],
     orderHistory: order.orderHistory[0]
    }));
  
    return formattedOrders;

  }

  async findOne(id: number) {

    return await this.prisma.order.findUnique({
      where: {
        id: id
      },
      include: {
        customerDetails: true,
        orderItems: true,
        orderHistory: true,
      }
    })
  }
  async remove(id: number) {
    return await this.prisma.order.delete({
      where: {
        id: id
      }
    })
  }
  async update(id: number, createOrderDto: CreateOrderDto) {


    return await this.prisma.order.update({
      where: {
        id: id
      },
      data: {
        advancePayment: createOrderDto.advancePayment,
        remainingPayment: createOrderDto.remainingPayment,
        totalPayment: createOrderDto.totalPayment,


      }
    })
  }
}
