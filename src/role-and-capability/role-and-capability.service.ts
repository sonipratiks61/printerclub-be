import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleAndCapabilityDto } from './dto/role-and-capability.dto';
import { RoleAndCapabilityMapping } from '@prisma/client';

@Injectable()
export class RoleAndCapabilityService {
  constructor(private prisma: PrismaService) {}

  async create(
    roleAndCapabilityDto: RoleAndCapabilityDto,
  ): Promise<RoleAndCapabilityMapping[]> {
    try {
      const { roleId, capabilityIds } = roleAndCapabilityDto;

      if (capabilityIds.length == 0) {
        throw new Error(`Atleast the one capabilityIds`);
      }
      // Check if the roleId and capabilityIds are valid
      const existingRole = await this.prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!existingRole) {
        throw new Error(`Role with ID ${roleId} not found.`);
      }

      const capabilities = await this.prisma.capability.findMany({
        where: { id: { in: capabilityIds } },
      });

      if (capabilities.length !== capabilityIds.length) {
        throw new Error('Invalid capabilityIds');
      }

      const createdMappings: RoleAndCapabilityMapping[] = [];

      for (const capabilityId of capabilityIds) {
        const existingMapping =
          await this.prisma.roleAndCapabilityMapping.findFirst({
            where: {
              roleId,
              capabilityId,
            },
          });

        if (existingMapping) {
          throw new Error(
            'Mapping already exists for roleId  and capabilityId',
          );
        }

        const createdMapping =
          await this.prisma.roleAndCapabilityMapping.create({
            data: {
              roleId,
              capabilityId,
            },
          });

        createdMappings.push(createdMapping);
      }

      return createdMappings;
    } catch (error) {
      console.error('Error creating RoleAndCapabilityMapping:', error);
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.roleAndCapabilityMapping.findMany({
      include: {
        role: true,
        capability: true,
      },
    });
  }
}
