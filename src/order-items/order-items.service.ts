// import { Injectable, NotFoundException } from '@nestjs/common';


import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatusService } from 'src/order-status/order-status.service';
import { OrderHistoryService } from 'src/order-history/order-history.service';
import { UpdateOrderItemDto } from './dto/order-Item.dto';

@Injectable()
export class OrderItemsService {
    constructor(
        private prisma: PrismaService,
        private orderStatusService: OrderStatusService,
    ) {
    }

    async orderItemsSearchByOrderId(orderId: number) {
        const checkOrderIdExist = await this.prisma.orderItem.findFirst({
            where: {
                orderId: orderId
            }
        })
        if (!checkOrderIdExist) {
            throw new NotFoundException("Invalid Order Id")
        }
        const data = await this.prisma.orderItem.findMany({
            where: {
                orderId: orderId
            },

        })
        return data;
    }

    async findAll() {
        return await this.prisma.orderItem.findMany({
            include: {
                product: true
            }
        })
    }

    async findOne(id: number) {
        const data = await this.prisma.orderItem.findUnique({
            where: {
                id: id,
            },
            select: {
                orderItemStatus: true,
                workflow: {
                    select: {
                        id: true,
                        name: true,
                        sequence: true,
                    }
                }
            }
        });

        if (!data) {
            throw new NotFoundException('Invalid Order Id');
        }

        const sequence = Array.isArray(data.workflow.sequence) ? data.workflow.sequence : [];

        const formattedSequence = await Promise.all(
            sequence
                .filter((item): item is number => typeof item === 'number')
                .map(async (id: number) => {
                    const formate = await this.orderStatusService.findOne(id);
                    return {
                        id: formate?.id,
                        name: formate?.status,
                    };
                })
        );


        const history = await this.prisma.orderHistory.findMany({
            where: { orderItemId: id },
            orderBy: { timestamp: 'asc' },
            select: {
                id: true,
                updatedById: true,
                statusId: true,
                timestamp: true,
                updatedBy: {
                    select: {
                        name: true
                    }
                }

            }
        });
        const completedStatus = history.map(record => {
            return {
                updatedBy: record.updatedBy.name,
                timestamp: record.timestamp,
                statusId: record.statusId
            };
        })
        const completedStatusFilter = await Promise.all(history.map(async record => {
            const status = await this.orderStatusService.findOne(record.statusId);
            return {
                
                id: record.statusId,
                name: status?.status 
            };
        }));
        
        const result = {
            ...data,
            workflow: {
                ...data.workflow,
                sequence: data.orderItemStatus === 'Cancelled'
                    ? completedStatusFilter
                    : formattedSequence.map(item => ({ id: item.id, name: item.name })),
                completedStatus: completedStatus
            }
        };
        return result;
    }

    async remove(id: number) {
        return await this.prisma.orderItem.delete({
            where: {
                id: id
            }
        })
    }

    async updateOrderItemStatus(id: number, updateOrderItemDto: UpdateOrderItemDto) {
        const isExistStatusId = await this.orderStatusService.findOne(updateOrderItemDto.statusId)
        if (!isExistStatusId) {
            throw new NotFoundException('Order Status Id not found');
        }

        const orderItem = await this.prisma.orderItem.findUnique({
            where: {
                id: id
            }
        });
    
        if (!orderItem) {
            throw new NotFoundException('Order Item not found');
        }
        if (orderItem.orderItemStatus === 'Completed') {
            throw new BadRequestException('Cannot cancel an order item with a completed')
        }
        await this.prisma.orderItem.update({
            where: {
                id: id
            },
            data: {
                orderItemStatus: 'Cancelled'
            }

        });
        
    
        
        const isCheck = await this.prisma.orderHistory.findFirst({
            where: {
                statusId: 1,
                orderItemId: id
            }
        })
        if (isCheck) {
            throw new ConflictException("This order item is Already Cancel");
        }
        else {
            const data = await this.prisma.orderHistory.create({
                data: {
                    orderItemId: id,
                    statusId: updateOrderItemDto.statusId,
                    updatedById: updateOrderItemDto.updatedBy,
                    timestamp: new Date()
                }
            });
            return data;
        }
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
