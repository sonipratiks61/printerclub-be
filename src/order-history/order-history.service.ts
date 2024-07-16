import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderHistoryDto } from './dto/order-history.dto';

@Injectable()
export class OrderHistoryService {
    constructor(
        private prisma: PrismaService,) { }

    async create(createOrderHistoryDto: CreateOrderHistoryDto, ownerName: string) {
        const { status, orderId } = createOrderHistoryDto;

        const existingOrderHistory = await this.prisma.orderHistory.findFirst({
            where: {
                orderId: orderId,
                status: status,
            },
        });

        if (existingOrderHistory) {
            throw new ConflictException("Status already exists for this orderId");
        }

        const checkOrderStatus = await this.prisma.orderStatus.findFirst({
            where: {
                status: createOrderHistoryDto.status
            }
        })
        if (!checkOrderStatus) {
            throw new BadRequestException("Invalid Status");
        }
        const data = await this.prisma.orderHistory.create({
            data: {
                status: status,
                ownerName: ownerName,
                orderId: orderId,
            },
        });

        return data;
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

    async findOrderById(orderId: number) {
        const checkOrderIdExist = await this.prisma.orderHistory.findFirst({
            where: {
                orderId: orderId
            }
        })
        if (!checkOrderIdExist) {
            throw new NotFoundException("Invalid Order Id")
        }
        const data = await this.prisma.orderHistory.findMany({
            where: {
                orderId: orderId
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
                status: createOrderHistoryDto.status,

            }
        })
    }
}
