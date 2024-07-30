import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CustomerDetailsService } from 'src/customer-details/customer-details.service';
import { CreateOrderItemsDto } from 'src/order-items/dto/create-order-Item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDetailsDto } from 'src/customer-details/dto/customer-details.dto';
import { ProductService } from 'src/product/product.service';
import { generateInvoiceNumber } from 'utils/invoiceFunction/invoiceFunction';
import { CreateAddressDto } from 'src/user/dto/create-and-update-address.dto';

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
        throw new NotFoundException("One of the Products does not exist");
      }
    }
  
    const invoiceNumber = await generateInvoiceNumber();
    const orderItemsWithAddressIds = await Promise.all(orderItems.map(async (item) => {
      let isMeasurementAddressId = item.isMeasurementAddressId;
  
      if (!isMeasurementAddressId && item.address&&item.city&&item.country&&item.pinCode&&item.state) {
        const createdAddress = await this.prisma.address.create({
          data: {
            address: item.address,
            city: item.city,
            state: item.state,
            country: item.country,
            pinCode: item.pinCode
          },
        });
        isMeasurementAddressId = createdAddress.id;
      }
  
      return {
        ...item,
        isMeasurementAddressId,
      };
    }));
    const createdOrder = await this.prisma.order.create({
      data: {
        advancePayment,
        remainingPayment,
        totalPayment,
        paymentMode,
        invoiceNumber,
        ownerName,
        customerDetails: {
          create: {
            name: customerDetails.name,
            mobileNumber: customerDetails.mobileNumber,
            email: customerDetails.email,
            additionalDetails: customerDetails.additionalDetails,
            address:{
              create: {
                address: customerDetails.address.address,
                city:customerDetails.address.city,
                state:customerDetails.address.state,
                pinCode: customerDetails.address.pinCode,
                country: customerDetails.address.country,
              }
            }
          }
        },
        orderItems: {
          createMany: {
            data: orderItemsWithAddressIds.map((item: CreateOrderItemsDto) => ({
              quantity: item.quantity,
              name: item.name,
              price: item.price,
              additionalDetails: item.additionalDetails,
              productId: item.productId,
              gst: item.gst,
              isMeasurementAddressId: item.isMeasurementAddressId,
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
        orderHistory: {
          create: {
            status: "Pending",
            ownerName: ownerName
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
    const orders = await this.prisma.order.findMany({
      select: {
        id: true,
        paymentMode: true,
        remainingPayment: true,
        totalPayment: true,
        advancePayment: true,
        ownerName: true,
        invoiceNumber: true,
        orderItems: {
          select: {
            id: true,
            quantity: true,
            name: true,
            price: true,
            additionalDetails: true,
            productId: true,
            gst: true,
            discount: true,
            description: true,
            attributes: true,
            ownerName: true,
            measurement: true,
            isMeasurementAddress: true,
          }
        },
        customerDetails:
        {
          select: {
            id: true,
            name: true,
            email: true,
            mobileNumber: true,
            additionalDetails: true,
            address: true
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
      advancePayment: order.advancePayment.toFixed(2),
      totalPayment: order.totalPayment.toFixed(2),
      remainingPayment: order.remainingPayment.toFixed(2),
      paymentMode: order.paymentMode,
      ownerName: order.ownerName,
      orderItems: order.orderItems,
      customerDetails: order.customerDetails[0],
      orderHistory: order.orderHistory[0],
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
