import { ConflictException, Injectable } from "@nestjs/common";
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
            showToUser: createOrderStatusDto.showToUser,
            description: createOrderStatusDto.description,
            dependOn: dependOnId
          },
        });
        return orderStatus;
      }

  async findAll() {
    const orderStatuses = await this.prisma.orderStatus.findMany({
      where:{dependOn:null, id: {
        not: 1,
      },},
      select:{
        id:true,
        status:true,
        description:true,
        showToUser: true,
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
          showToUser: orderStatus.showToUser,
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
        showToUser: updateOrderStatusDto.showToUser,
        description:updateOrderStatusDto.description,
        dependOn:updateOrderStatusDto.dependOn
      },
    });
    return orderStatus;
  }

  async remove(id: number) {
    const workflows = await this.prisma.workFlow.findMany({
      where: {
        sequence: {
          array_contains: id,
        },
      },
      select: { id: true, name: true },
    });
  
    if (workflows.length > 0) {
      throw new ConflictException(
        `OrderStatus ID ${id} is used in workflow(s): ${workflows
          .map((w) => w.name)
          .join(', ')}`
      );
    }
  
    const roles = await this.prisma.roleAndOrderStatusMapping.findMany({
      where: { orderStatusId: id },
      select: {
        role: { select: { id: true, name: true } },
      },
    });
  
    if (roles.length > 0) {
      throw new ConflictException(
        `OrderStatus ID ${id} is assigned to role(s): ${roles
          .map((r) => r.role.name)
          .join(', ')}`
      );
    }
  
    const orderStatus = await this.prisma.orderStatus.delete({
      where: { id },
    });
  
    return orderStatus;
  }
  
}