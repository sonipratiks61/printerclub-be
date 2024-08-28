import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CustomerDetailsService } from 'src/customer-details/customer-details.service';
import { CreateOrderItemsDto } from 'src/order-items/dto/order-Item.dto';
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

  async create(createOrderDto: CreateOrderDto, ownerName: string,userId:number) {
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

      if (!isMeasurementAddressId && item.address && item.city && item.country && item.pinCode && item.state) {
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
        userId:userId,
        invoiceNumber,
        ownerName,
        customerDetails: {
          create: {
            name: customerDetails.name,
            mobileNumber: customerDetails.mobileNumber,
            email: customerDetails.email,
            additionalDetails: customerDetails.additionalDetails,
            address: {
              create: {
                address: customerDetails.address.address,
                city: customerDetails.address.city,
                state: customerDetails.address.state,
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
              workflowId: item.workflowId,
              additionalDetails: item.additionalDetails,
              productId: item.productId,
              gst: item.gst,
              isMeasurementAddressId: item.isMeasurementAddressId,
              measurement: item.measurement,
              discount: item.discount,
              ownerName,
              orderItemStatus:'Pending',
              description: item.description,
              attributes: item.attributes?.map(attr => ({
                name: attr.name,
                value: attr.value,
              })),
            })),

          },
        },
      },
      include: {
        orderItems: true,
        customerDetails: true
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

        }
      }
    })
    const formattedOrders = orders.map(order => ({
      id: order.id,
      advancePayment: Number(order.advancePayment)?.toFixed(2),
      totalPayment: Number(order.totalPayment).toFixed(2),
      remainingPayment: Number(order.remainingPayment).toFixed(2),
      paymentMode: order.paymentMode,
      ownerName: order.ownerName,
      orderItems: order.orderItems,
      customerDetails: order.customerDetails,
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
        orderItems: true
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

  // async createUserOrder(createOrderDto: CreateOrderDto, ownerName: string, userId: number) {

  //   const { advancePayment, totalPayment, paymentMode, orderItems } = createOrderDto;
  //   const productIds = [...new Set(orderItems.map(item => item.productId))];
  
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     include: { addresses: true }, 
  //   });
  
  //   if (!user) {
  //     throw new NotFoundException("User does not exist");
  //   }
  

  //   for (const productId of productIds) {
  //     const product = await this.productService.findOne(productId);
  //     if (!product) {
  //       throw new NotFoundException("One of the Products does not exist");
  //     }
  //   }
  
  //   const invoiceNumber = await generateInvoiceNumber();
  
  //     const orderItemsWithAddressIds = await Promise.all(orderItems.map(async (item) => {
  //     let isMeasurementAddressId = item.isMeasurementAddressId;
  
  //     if (!isMeasurementAddressId && item.address && item.city && item.country && item.pinCode && item.state) {
  //       const createdAddress = await this.prisma.address.create({
  //         data: {
  //           address: item.address,
  //           city: item.city,
  //           state: item.state,
  //           country: item.country,
  //           pinCode: item.pinCode,
  //         },
  //       });
  //       isMeasurementAddressId = createdAddress.id;
  //     }
  
  //     return {
  //       ...item,
  //       isMeasurementAddressId,
  //     };
  //   }));
  
  //   const createdOrder = await this.prisma.order.create({
  //     data: {
  //       advancePayment,
  //       remainingPayment: 0,
  //       totalPayment,
  //       paymentMode,
  //       invoiceNumber,
  //       ownerName,
  //       userId,
  //       customerDetails: {
  //         create: {
  //           name: user.name, 
  //           mobileNumber: user.mobileNumber, 
  //           email: user.email,  
  //           address: {
  //             create: {
  //               address: user.addresses.length ? user.addresses[0].address : null,
  //               city: user.addresses.length ? user.addresses[0].city : null,
  //               state: user.addresses.length ? user.addresses[0].state : null,
  //               pinCode: user.addresses.length ? user.addresses[0].pinCode : null,
  //               country: user.addresses.length ? user.addresses[0].country : null,
  //             }
  //           }
  //         }
  //       },
  //       orderItems: {
  //         createMany: {
  //           data: orderItemsWithAddressIds.map((item: CreateOrderItemsDto) => ({
  //             quantity: item.quantity,
  //             name: item.name,
  //             price: item.price,
  //             workflowId: item.workflowId,
  //             additionalDetails: item.additionalDetails,
  //             productId: item.productId,
  //             gst: item.gst,
  //             isMeasurementAddressId: item.isMeasurementAddressId,
  //             measurement: item.measurement,
  //             discount: item.discount,
  //             ownerName,
  //             orderItemStatus: 'Pending',
  //             description: item.description,
  //             attributes: item.attributes?.map(attr => ({
  //               name: attr.name,
  //               value: attr.value,
  //             })),
  //           })),
  //         },
  //       },
  //     },
  //     include: {
  //       orderItems: true,
  //       customerDetails: true,
  //     },
  //   });
  
  //   return createdOrder;
  // }
  
  async createUserOrder(createOrderDto: CreateOrderDto, ownerName: string, userId: number) {
    const { advancePayment, totalPayment, paymentMode, orderItems } = createOrderDto;
    const productIds = [...new Set(orderItems.map(item => item.productId))];
  
    // Step 1: Find the user by userId
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });
  
    if (!user) {
      throw new NotFoundException("User does not exist");
    }
  
    // Step 2: Validate products
    for (const productId of productIds) {
      const product = await this.productService.findOne(productId);
      if (!product) {
        throw new NotFoundException("One of the Products does not exist");
      }
    }
  
    // Step 3: Generate Invoice Number
    const invoiceNumber = await generateInvoiceNumber();
  
    // Step 4: Process order items and handle address creation if needed
    const orderItemsWithAddressIds = await Promise.all(orderItems.map(async (item) => {
      let isMeasurementAddressId = item.isMeasurementAddressId;
  
      // Handle address creation
      if (!isMeasurementAddressId && item.address && item.city && item.country && item.pinCode && item.state) {
        const createdAddress = await this.prisma.address.create({
          data: {
            address: item.address,
            city: item.city,
            state: item.state,
            country: item.country,
            pinCode: item.pinCode,
          },
        });
        isMeasurementAddressId = createdAddress.id;
      }
  
      return {
        ...item,
        isMeasurementAddressId,
      };
    }));
  
    // Step 5: Create the order
    const createdOrder = await this.prisma.order.create({
      data: {
        advancePayment,
        remainingPayment: 0,
        totalPayment,
        paymentMode,
        invoiceNumber,
        ownerName,
        userId,
        customerDetails: {
          create: {
            name: user.name,
            mobileNumber: user.mobileNumber,
            email: user.email,
            address: {
              create: {
                address: user.addresses.length ? user.addresses[0].address : null,
                city: user.addresses.length ? user.addresses[0].city : null,
                state: user.addresses.length ? user.addresses[0].state : null,
                pinCode: user.addresses.length ? user.addresses[0].pinCode : null,
                country: user.addresses.length ? user.addresses[0].country : null,
              },
            },
          },
        },
        orderItems: {
          createMany: {
            data: orderItemsWithAddressIds.map((item: CreateOrderItemsDto) => ({
              quantity: item.quantity,
              name: item.name,
              price: item.price,
              workflowId: item.workflowId,
              additionalDetails: item.additionalDetails,
              productId: item.productId,
              gst: item.gst,
              isMeasurementAddressId: item.isMeasurementAddressId,
              measurement: item.measurement,
              discount: item.discount,
              ownerName,
              orderItemStatus: 'Pending',
              description: item.description,
              attributes: item.attributes?.map(attr => ({
                name: attr.name,
                value: attr.value,
              })),
            })),
          },
        },
      },
      include: {
        orderItems: true,
        customerDetails: true,
      },
    });
  
    // Step 6: Handle attachments for each created order item
    for (const orderItem of createdOrder.orderItems) {
      // Create an attachment association for each orderItem
      const isUploadFile = await this.prisma.attachmentAssociation.create({
        data: {
          relationId: orderItem.id,  // Using the orderItem's ID
          relationType: 'orderItem',          
        },
      });
  
      // Step 7: Associate attachments with each order item
      for (const attachmentId of createOrderDto.attachmentIds) {  // Assuming attachmentIds is in createOrderDto
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
    }
  
    return createdOrder;
  }
  
  
}
