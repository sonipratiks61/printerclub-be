import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOrderStatusDto, UpdateOrderStatusDto } from "./dto/order-status.dto";

@Injectable()
export class OrderStatusService {
    constructor (
        private prisma:PrismaService,
    ){}
   
    
      async create(createOrderStatusDto: CreateOrderStatusDto) {
        const orderStatus = await this.prisma.orderStatus.create({
          data: {
            status: createOrderStatusDto.status,
            description: createOrderStatusDto.description,
            dependOn: createOrderStatusDto.dependOn
          },
        });
        return orderStatus;
      }

  async findAll() {
    const orderStatuses = await this.prisma.orderStatus.findMany();
    return orderStatuses;
  }

  async findOne(id: number) {
    const orderStatus = await this.prisma.orderStatus.findUnique({
      where: { id },
    });
    return orderStatus;
  }

  async update(id: number,updateOrderStatusDto:UpdateOrderStatusDto)
  {
    const orderStatus = await this.prisma.orderStatus.update({
      where: { id:id },
      data: {
        status:updateOrderStatusDto.status,
        description:updateOrderStatusDto.description,
        dependOn:updateOrderStatusDto.dependOn
      },
    });
    return orderStatus;
  }

  async remove(id: number) {
    const orderStatus = await this.prisma.orderStatus.delete({
      where: { id },
    });
    return orderStatus;
  }
}