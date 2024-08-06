import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderHistoryDto } from './dto/order-history.dto';
import { OrderStatusService } from 'src/order-status/order-status.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderHistoryService {
    constructor(
        private prisma: PrismaService,
        private orderStatusService: OrderStatusService,
        private orderItemsService: OrderItemsService,
        private userService: UserService) { }

    async create(createOrderHistoryDto: CreateOrderHistoryDto) {

        const { orderItemId, statusId, updatedById } = createOrderHistoryDto;

        const existingOrderHistory = await this.prisma.orderHistory.findFirst({
            where: {
                orderItemId: orderItemId,
                statusId: statusId
            },
        });

        if (existingOrderHistory) {
            throw new ConflictException("Status already exists for this order item Id");
        }
        const orderItem = await this.orderItemsService.findOne(orderItemId)
        if (!orderItem) {
            throw new NotFoundException("Order Item not found");
        }
        const status = await this.orderStatusService.findOne(statusId);
        if (!status) {
            throw new NotFoundException("Status not found");
        }
        const updatedBy = await this.userService.findOne(updatedById)
        if (!updatedBy) {
            throw new NotFoundException("User not found");
        }
       
        const isCancel=await this.prisma.orderHistory.findFirst({

            where: {
                statusId:1,
                orderItemId:orderItemId,
            }
        })
        if(isCancel)
        {
            throw new BadRequestException('OrderItem is Already cancel');
        }
        else{
        const data = await this.prisma.orderHistory.create({
            data: {
                updatedById: updatedById,
                orderItemId: orderItemId,
                statusId: statusId,
                timestamp: new Date()
            },
        });
        const isOrderStatus=await this.orderStatusService.findOne(data.statusId);
        const isStatusName=isOrderStatus.status;
        await this.prisma.orderItem.update({
            where:{
                id:orderItemId
            },
            data:{
                orderItemStatus:isStatusName
            }
        })
        return data;
    }

        
    }


    async findAll() {
        return await this.prisma.orderHistory.findMany()
    }

    async findOne(id: number) {
        return await this.prisma.orderHistory.findUnique({
            where: {
                id: id
            }
        })
    }

    async findOrderItemById(orderItemId: number) {
        const checkOrderIdExist = await this.prisma.orderHistory.findFirst({
            where: {
                orderItemId: orderItemId
            }
        })
        if (!checkOrderIdExist) {
            throw new NotFoundException("Invalid Order Item Id")
        }
        const data = await this.prisma.orderHistory.findMany({
            where: {
                orderItemId: orderItemId
            },

        })
        return data;
    }


    async remove(id: number) {
        return await this.prisma.orderHistory.delete({
            where: {
                id: id
            }
        })
    }

    async update(id: number, createOrderHistoryDto: CreateOrderHistoryDto) {
        return await this.prisma.orderHistory.update({
            where: {
                id: id
            },
            data: {
                statusId: createOrderHistoryDto.statusId,

            }
        })
    }
}
