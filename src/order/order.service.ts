import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { CustomerDetailsService } from 'src/customer-details/customer-details.service';
import { OrderHistoryService } from 'src/order-history/order-history.service';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private orderItemService: OrderItemsService,
        private orderHistoryService: OrderHistoryService,
        private customerDetailsService: CustomerDetailsService) {
    }

    async create(createOrderDto: CreateOrderDto,ownerName:string) {
     
        const orderCustomer = await this.customerDetailsService.findOne(createOrderDto.orderCustomerId);

        if (!orderCustomer) {
            throw new NotFoundException("Invalid OrderCustomer  Id");
        }

        const orderItem = await this.orderItemService.findOne(createOrderDto.orderItemId);
        if (!orderItem) {
            throw new NotFoundException("Invalid OrderItem  Id");
        }

        const orderHistory = await this.orderHistoryService.findOne(createOrderDto.orderHistoryId)
        if (!orderHistory) {
            throw new NotFoundException("Invalid OrderHistory Id");
        }

        const data = await this.prisma.order.create({
            data: {
                orderHistoryId:createOrderDto.orderHistoryId,
                orderItemId:createOrderDto.orderItemId,
                orderCustomerId:createOrderDto.orderCustomerId,
                advancePayment:createOrderDto.advancePayment,
                remainingPayment:createOrderDto.remainingPayment,
                totalPayment:createOrderDto.totalPayment,
                GST:createOrderDto.GST,
                ownerName:ownerName,
                discount:createOrderDto.discount,
                invoiceVarient:createOrderDto.invoiceVarient
            }
        });

        return data;
    }


    async findAll() {
        return await this.prisma.order.findMany({
            include: {
                orderCustomer: true,
                orderHistory: true,
                orderItem: true,
            }
        })
    }

    async findOne(id: number) {

        return await this.prisma.order.findUnique({
            where: {
                id: id
            },
            include: {
                orderCustomer: true,
                orderHistory: true,
                orderItem: true,
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

        const orderCustomer = await this.customerDetailsService.findOne(createOrderDto.orderCustomerId);
        if (!orderCustomer) {
            throw new NotFoundException("Invalid OrderCustomer  Id");
        }
        const orderItem = await this.orderItemService.findOne(createOrderDto.orderItemId);
        if (!orderItem) {
            throw new NotFoundException("Invalid OrderItem  Id");
        }
        const orderHistory=await this.orderHistoryService.findOne(createOrderDto.orderHistoryId);
        if (!orderHistory) {
            throw new NotFoundException("Invalid OrderHistory Id");
        }

        return await this.prisma.order.update({
            where: {
                id: id
            },
            data: {
                orderHistoryId: createOrderDto.orderHistoryId,
                orderItemId: createOrderDto.orderItemId,
                orderCustomerId: createOrderDto.orderCustomerId,
                advancePayment: createOrderDto.advancePayment,
                remainingPayment: createOrderDto.remainingPayment,
                totalPayment: createOrderDto.totalPayment,
                GST: createOrderDto.GST,
                discount:createOrderDto.discount,
                invoiceVarient: createOrderDto.invoiceVarient

            }
        })
    }
}
