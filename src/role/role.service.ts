import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const data = this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        capabilities: {
          create: createRoleDto.capabilities,
        },
      },
    });
    return data;
  }

  async findAll() {
    return await this.prisma.role.findMany({
      include: {
        capabilities: true,
      },
    });
  }
}
