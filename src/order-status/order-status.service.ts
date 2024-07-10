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
    const dependOnId = createOrderStatusDto.dependOn
    ? createOrderStatusDto.dependOn
    : null;
        const orderStatus = await this.prisma.orderStatus.create({
          data: {
            status: createOrderStatusDto.status,
            description: createOrderStatusDto.description,
            dependOn: dependOnId
          },
        });
        return orderStatus;
      }

  async findAll() {
    const orderStatuses = await this.prisma.orderStatus.findMany({
      select:{
        id:true,
        status:true,
        description:true,
        dependOn:true,
        subOrderStatus : {
          select:{
            id:true,
            status:true,
            description:true,
            dependOn:true,

          }

        }
      }
    })
      const formatted = orderStatuses.flatMap((orderStatus) => [
        {
          id: orderStatus.id,
          status: orderStatus.status,
          description: orderStatus.description,
          dependOn:orderStatus.dependOn
        },
        ...orderStatus.subOrderStatus.map((subOrderStatus) => ({
          id: subOrderStatus.id,
          status: subOrderStatus.status,
          description:subOrderStatus.description,
          dependOn:subOrderStatus.dependOn
        })),
      ])
    return formatted;
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