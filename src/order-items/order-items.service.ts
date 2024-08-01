// import { Injectable, NotFoundException } from '@nestjs/common';


import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatusService } from 'src/order-status/order-status.service';
import { OrderHistoryService } from 'src/order-history/order-history.service';

@Injectable()
export class OrderItemsService {
    constructor(private orderStatusService: OrderStatusService,
        private prisma: PrismaService) {
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
            where: { id: id },
            select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
                attributes: true,
                productId: true,
                orderId: true,
                isMeasurementAddressId: true,
                isMeasurementAddress: true,
                gst: true,
                ownerName: true,
                description: true,
                discount: true,
                measurement: true,
                isConfirmed: true,
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

        const sequence = Array.isArray(data.workflow?.sequence) ? data.workflow.sequence : [];

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
            orderBy: { timestamp: 'asc' }
        });

        const userIds = [...new Set(history.map(record => record.updatedById))];

        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true }
        });

        const userMap = new Map(users.map(user => [user.id, user.name]));

        return {
            ...data,
            workflow: {
                ...data.workflow,
                sequence: formattedSequence.map((item) => { return { id: item.id, name: item.name } }),
                completedStatus: history.map(record => {
                    return {
                        updatedBy: userMap.get(record.updatedById),
                        timestamp: record.timestamp,
                        statusId: record.statusId
                    };
                })
            }
        };
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
