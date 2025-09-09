import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CustomerDetailsService } from 'src/customer-details/customer-details.service';
import { CreateOrderItemsDto } from 'src/order-items/dto/order-Item.dto';
import { CreateOrderDto, OrderUserDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDetailsDto } from 'src/customer-details/dto/customer-details.dto';
import { ProductService } from 'src/product/product.service';
import { generateInvoiceNumber } from 'utils/invoiceFunction/invoiceFunction';
import { CreateAddressDto } from 'src/user/dto/create-and-update-address.dto';
import { AttachmentService } from 'src/attachment/attachment.service';
import { calculateAttributesPrice, calculatePrice } from 'utils/calculatePriceFunction/calculatePriceFunction';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService,
    private productService: ProductService,
    private attachmentService: AttachmentService) { }

  async create(createOrderDto: CreateOrderDto, ownerName: string, userId: number) {
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
        userId: userId,
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
              deliveryDate: item.deliveryDate,
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
                price: attr.price,
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

  async fetchAll(userId: number) {

    let orders;
    const userDetails = await this.prisma.user.findFirst({
      where: {
        id: userId
      },
      select: {
        role: true
      }
    })

    const id = userDetails.role.id;
    if (id !== 2) {

      orders = await this.prisma.order.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          paymentMode: true,
          remainingPayment: true,
          totalPayment: true,
          advancePayment: true,
          ownerName: true,
          invoiceNumber: true,
          createdAt: true,
          userId: true,
          orderItems: {
            orderBy: {
              deliveryDate: 'asc',
            },
            select: {
              id: true,
              quantity: true,
              name: true,
              price: true,
              deliveryDate: true,
              attachmentType: true,
              additionalDetails: true,
              productId: true,
              gst: true,
              discount: true,
              description: true,
              attributes: true,
              ownerName: true,
              measurement: true,
              isMeasurementAddress: true,
              orderItemStatus: true,
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  mobileNumber: true,
                },
              },
              expectedBy: true
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

      const attachments = await this.prisma.attachmentAssociation.findMany({
        where: {
          relationType: 'orderItem',
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
      const attachmentMap = attachments.reduce((acc, item) => {
        if (item.attachments.length > 0) {
          acc[item.relationId] = item.attachments[0].attachment; // Take only the first attachment
        }
        return acc;
      }, {} as Record<number, { id: number; fileName: string; filePath: string } | null>);

      const formattedAllOrders = orders.map(order => {
        let earliestNonExpiredDate = null;
        let earliestExpiredDate = null;
        
        order.orderItems.forEach(item => {
            if (item.deliveryDate) {
                const itemDate = new Date(item.deliveryDate);
                const today = new Date();
    
                if (itemDate >= today) {
                    earliestNonExpiredDate = !earliestNonExpiredDate || itemDate < earliestNonExpiredDate
                        ? itemDate
                        : earliestNonExpiredDate;
                } else {
                    earliestExpiredDate = !earliestExpiredDate || itemDate < earliestExpiredDate
                        ? itemDate
                        : earliestExpiredDate;
                }
            }
        });
    
        return {
            ...order,
            orderItems: order.orderItems.map(item => ({
                ...item,
                assignedTo: item.assignedTo ? {...item.assignedTo, expectedBy: item.expectedBy } : null,
                attachments: attachmentMap[item.id] || null, 
            })),
            earliestDeliveryDate: earliestNonExpiredDate || earliestExpiredDate,
        };
    });
    
    return formattedAllOrders.sort((a, b) => {
        const today = new Date().toISOString().split('T')[0];
    
        const dateA = a.earliestDeliveryDate ? a.earliestDeliveryDate.toISOString().split('T')[0] : null;
        const dateB = b.earliestDeliveryDate ? b.earliestDeliveryDate.toISOString().split('T')[0] : null;
    
        const createdDateA = new Date(a.createdAt).toISOString().split('T')[0];
        const createdDateB = new Date(b.createdAt).toISOString().split('T')[0];
    
        const isExpiredA = dateA && dateA < today;
        const isExpiredB = dateB && dateB < today;
    
        if (!isExpiredA && !isExpiredB) {
            if (dateA && dateB) return dateA.localeCompare(dateB);
            if (dateA) return -1;
            if (dateB) return 1;
        }
    
        if (!isExpiredA && isExpiredB) return -1;
        if (isExpiredA && !isExpiredB) return 1;
    
        if (isExpiredA && isExpiredB) return dateB.localeCompare(dateA);
    
        return createdDateB.localeCompare(createdDateA);
    });
    
    
    }
    else {
      orders = await this.prisma.order.findMany({
        where: {
          userId: userId,
        }, orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          paymentMode: true,
          remainingPayment: true,
          totalPayment: true,
          advancePayment: true,
          ownerName: true,
          invoiceNumber: true,
          createdAt: true,
          userId: true,
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
              orderItemStatus: true,
              ownerName: true,
            },
          },
          customerDetails: {
            select: {
              id: true,
              name: true,
              email: true,
              mobileNumber: true,
              additionalDetails: true,
              address: {
                select: {
                  id: true,
                  country: true,
                  state: true,
                  city: true,
                  pinCode: true,
                  address: true,
                },
              },
            },
          },
        },
      });

      const attachments = await this.prisma.attachmentAssociation.findMany({
        where: {
          relationType: 'orderItem',
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

      const attachmentMap = attachments.reduce((acc, item) => {
        if (item.attachments.length > 0) {
          acc[item.relationId] = item.attachments[0].attachment; // Take only the first attachment
        }
        return acc;
      }, {} as Record<number, { id: number; fileName: string; filePath: string } | null>);
      const formattedOrders = orders.map(order => ({
        id: order.id,
        advancePayment: Number(order.advancePayment)?.toFixed(2),
        totalPayment: Number(order.totalPayment).toFixed(2),
        remainingPayment: Number(order.remainingPayment).toFixed(2),
        paymentMode: order.paymentMode,
        ownerName: order.ownerName,
        invoiceNumber: order.invoiceNumber,
        createdAt: order.createdAt,
        userId: order.userId,
        customerDetails: {
          ...order.customerDetails,
          address: {
            ...order.customerDetails.address,
          },
        },
        orderItems: order.orderItems.map(item => ({
          ...item,
          attachments: attachmentMap[item.id] || null,
        })),
      }));
      return formattedOrders;
    }
  }
  async fetchAllDataByAdminUser(adminViewUserId:number)
  {
     const orders = await this.prisma.order.findMany({
        where: {
          userId: adminViewUserId,
        }, orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          paymentMode: true,
          remainingPayment: true,
          totalPayment: true,
          advancePayment: true,
          ownerName: true,
          invoiceNumber: true,
          createdAt: true,
          userId: true,
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
              orderItemStatus: true,
              ownerName: true,
            },
          },
          customerDetails: {
            select: {
              id: true,
              name: true,
              email: true,
              mobileNumber: true,
              additionalDetails: true,
              address: {
                select: {
                  id: true,
                  country: true,
                  state: true,
                  city: true,
                  pinCode: true,
                  address: true,
                },
              },
            },
          },
        },
      });
      const attachments = await this.prisma.attachmentAssociation.findMany({
        where: {
          relationType: 'orderItem',
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

      const attachmentMap = attachments.reduce((acc, item) => {
        if (item.attachments.length > 0) {
          acc[item.relationId] = item.attachments[0].attachment;
        }
        return acc;
      }, {} as Record<number, { id: number; fileName: string; filePath: string } | null>);
      const formattedOrders = orders.map(order => ({
        id: order.id,
        advancePayment: Number(order.advancePayment)?.toFixed(2),
        totalPayment: Number(order.totalPayment).toFixed(2),
        remainingPayment: Number(order.remainingPayment).toFixed(2),
        paymentMode: order.paymentMode,
        ownerName: order.ownerName,
        invoiceNumber: order.invoiceNumber,
        createdAt: order.createdAt,
        userId: order.userId,
        customerDetails: {
          ...order.customerDetails,
          address: {
            ...order.customerDetails.address,
          },
        },
        orderItems: order.orderItems.map(item => ({
          ...item,
          attachments: attachmentMap[item.id] || null,
        })),
      }));
      return formattedOrders;
    
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        paymentMode: true,
        remainingPayment: true,
        totalPayment: true,
        advancePayment: true,
        ownerName: true,
        invoiceNumber: true,
        createdAt: true,
        userId: true,
        orderItems: {
          orderBy: { deliveryDate: 'asc' },
          select: {
            id: true,
            quantity: true,
            name: true,
            price: true,
            deliveryDate: true,
            attachmentType: true,
            additionalDetails: true,
            productId: true,
            gst: true,
            discount: true,
            description: true,
            attributes: true,
            ownerName: true,
            measurement: true,
            isMeasurementAddress: true,
            orderItemStatus: true,
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
                mobileNumber: true,
              },
            },
            expectedBy: true,
          },
        },
        customerDetails: {
          select: {
            id: true,
            name: true,
            email: true,
            mobileNumber: true,
            additionalDetails: true,
            address: true,
          },
        },
      },
    });
  
    if (!order) {
      return null;
    }
  
    const attachments = await this.prisma.attachmentAssociation.findMany({
      where: { relationType: 'orderItem' },
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
  
    const attachmentMap = attachments.reduce((acc, item) => {
      if (item.attachments.length > 0) {
        acc[item.relationId] = item.attachments[0].attachment; // Take only the first attachment
      }
      return acc;
    }, {} as Record<number, { id: number; fileName: string; filePath: string } | null>);
  
    return {
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        assignedTo: item.assignedTo
          ? { ...item.assignedTo, expectedBy: item.expectedBy }
          : null,
        attachments: attachmentMap[item.id] || null,
      })),
    };
  }
  

  async findByOrderAndMobile(orderNumber: number, lastFourDigits: string) {
    return this.prisma.order.findFirst({
      where: {
        id: Number(orderNumber),
        customerDetails: {
          mobileNumber: {
            endsWith: lastFourDigits,
          },
        },
      },
      include: {
        customerDetails: {
          select: {
            id: true,
            name: true,
            email: true,
            mobileNumber: true,
            additionalDetails: true,
            address: {
              select: {
                id: true,
                country: true,
                state: true,
                city: true,
                pinCode: true,
                address: true,
              },
            },
          },
        },
        orderItems: true,
      },
    });
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

  async createUserOrder(createOrderDto: OrderUserDto, ownerName: string, userId: number) {
    const { paymentMode, orderItems } = createOrderDto;
    const productIds = [...new Set(orderItems.map(item => item.productId))];

    for (const productId of productIds) {
      const product = await this.productService.findOne(productId);
      if (!product) {
        throw new NotFoundException("One of the Products does not exist");
      }
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!user) {
      throw new NotFoundException("User does not exist");
    }
    let totalPayment = 0;
    const orderItemsWithAddressIds = await Promise.all(orderItems.map(async (item) => {


      const product = await this.productService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException("One of the Products does not exist");
      }
      const itemTotalPrice = calculatePrice({
        price: calculateAttributesPrice(item.attributes) ? Number(product.price) * calculateAttributesPrice(item.attributes) : Number(product.price),
        quantity: item.quantity,
        gst: product.gst,
        discount: product.discount || 0,
      });


      totalPayment += Number(itemTotalPrice);

      return {
        ...item,
        price: product.price,
        gst: product.gst,
        discount: product.discount,
        name: product.name,
        workflowId: product.workflowId,
        description: product.description
      };
    }));

    const createdOrder = await this.prisma.order.create({
      data: {
        advancePayment: totalPayment,
        remainingPayment: 0,
        totalPayment,
        paymentMode,
        invoiceNumber: await generateInvoiceNumber(),
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
            data: orderItemsWithAddressIds.map((item) => ({
              quantity: item.quantity,
              name: item.name,
              price: item.price,
              gst: item.gst,
              attachmentType: item.attachmentType,
              discount: item.discount,
              workflowId: item.workflowId,
              additionalDetails: item.additionalDetails,
              productId: item.productId,
              ownerName,
              orderItemStatus: 'Pending',
              description: item.description,
              attributes: item.attributes?.map(attr => ({
                name: attr.name,
                value: attr.value,
                price: attr.price,
                width: attr.width,
                height: attr.height
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

    for (const orderItem of createdOrder.orderItems) {
      const item = orderItems.find(oi => oi.productId === orderItem.productId);

      if (item && item.attachmentId) {
        const attachmentIds = Array.isArray(item.attachmentId) ? item.attachmentId : [item.attachmentId];

        for (const attachmentId of attachmentIds) {
          const isUploadFile = await this.prisma.attachmentAssociation.create({
            data: {
              relationId: orderItem.id,
              relationType: 'orderItem',
            },
          });
          const isCheckAttachment = await this.attachmentService.findOne(attachmentId);
          if (!isCheckAttachment) {
            throw new NotFoundException(`Attachment with ID ${attachmentId} not found`);
          }

          await this.prisma.attachmentToAssociation.create({
            data: {
              attachmentId: attachmentId,
              attachmentAssociationId: isUploadFile.id,
            },
          });
        }
      }
    }

    return createdOrder;
  }



}
