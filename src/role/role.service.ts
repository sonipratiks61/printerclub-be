import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) { }

  async findByName(name: string) {
    const roleName = await this.prisma.role.findUnique({
      where: {
        name: name
      }
    })
    return roleName;
  }

  async create(createRoleDto: CreateRoleDto) {
    const capabilityIds = createRoleDto.capabilityIds;
    const existingCapabilities = await this.prisma.capability.findMany({
      where: {
        id: { in: capabilityIds },
      },
    });
    if (existingCapabilities?.length !== capabilityIds?.length) {
    throw new NotFoundException("One or more capability IDs are invalid");
    }

    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        capabilityIds: {
          create: createRoleDto.capabilityIds.map((capabilityId) => ({
            capability: {
              connect: { id: capabilityId },
            },
          })),
        },
        orderStatusIds:{
          create: createRoleDto.orderStatusIds.map((orderStatusId) => ({
            orderStatus: {
              connect: { id: orderStatusId },
            },
          })),
        }
      },

    });
    return role;
  }
 
  async findAll() {
    const role = await this.prisma.role.findMany(
      {
select:{id:true,
  name:true,

          capabilityIds: {
            select: {
              capability: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          },
          orderStatusIds:{
            select:{
              orderStatus:{
                select:{
                  id:true,
                  status:true
                }
            }

          }
        }
      }
      }
    );
    const formattedRoles = role.map((role) => {
      return {
        id: role.id,
        name: role.name,
        capabilities: role.capabilityIds.map((capability) => {
          return {
            id: capability.capability.id,
            name: capability.capability.name,
          };
        }),
        orderStatuses: role.orderStatusIds.map((orderStatus) => {
          return {
            id: orderStatus.orderStatus.id,
            name: orderStatus.orderStatus.status
          };
        }),
      };
    });

    return formattedRoles;
  }
  //   async create(createRoleDto: CreateRoleDto) {
  //     const capabilityIds = createRoleDto.capabilityIds;
  //     const existingCapabilities = await this.prisma.capability.findMany({
  //       where: {
  //         id: { in: capabilityIds },
  //       },
  //     });
  // console.log(existingCapabilities ,existingCapabilities .length)
  //     if (existingCapabilities?.length !== capabilityIds?.length) {
  //       console.log(existingCapabilities?.length !== capabilityIds?.length)
  //       throw new NotFoundException("One or more capability IDs are invalid");
  //     }

  //     const role = await this.prisma.role.create({
  //       data: {
  //         name: createRoleDto.name,
  //         capabilities: {
  //           create: capabilityIds?.map((capabilityId) => ({
  //             capability: {
  //               connect: { id: capabilityId },
  //             },
  //           })),
  //         },
  //       },
  //       include: {
  //         capabilities: {
  //           include: {
  //             capability: true,
  //           },
  //         },
  //       },
  //     });

  //     return role;
  //   }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: id
      },
      select: {
        capabilityIds: {
          select: {
            capability: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        orderStatusIds:{
          select:{
            orderStatus:{
              select:{
          id:true,
          status:true
        }
      }
      }
      }
      }
    }
    );

    return role;
  }

  async delete(id: number) {
    const data= await this.prisma.user.deleteMany({
      where: {
        roleId:id
      }
    })
    const role = await this.prisma.role.delete({
      where: {
        id: id
      },
      include: {
        capabilityIds: {
          select: {
            capability: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    }
    );
    return role;
  }

  async updateRoleName(roleId: number, name: string): Promise<Role | null> {
    const role = await this.prisma.role.update({
      where: { id: roleId },
      data: { name },
    });
    return role;
  }
}
