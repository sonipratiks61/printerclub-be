import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleAndOrderStatusDto } from './dto/role-and-orderStatus.dto';
import { RoleAndOrderStatusMapping } from '@prisma/client';
import { OrderStatusService } from 'src/order-status/order-status.service';

@Injectable()
export class RoleAndOrderStatusService {
    constructor(
        private prisma: PrismaService,
        private orderStatusService: OrderStatusService
    ) { }

    async create(
        roleAndOrderStatusDto: RoleAndOrderStatusDto,
    ): Promise<RoleAndOrderStatusMapping[]> {
        const { roleId, orderStatusIds } = roleAndOrderStatusDto;
        if (!orderStatusIds || orderStatusIds.length === 0) {
            throw new Error('At least one orderStatusId must be provided.');
        }

        const existingRole = await this.prisma.role.findUnique({
            where: { id: roleId },
        });

        if (!existingRole) {
            throw new Error(`Role with ID ${roleId} not found.`);
        }

        const orderStatuses = await this.prisma.orderStatus.findMany({
            where: { id: { in: orderStatusIds } },
        });

        if (orderStatuses.length !== orderStatusIds.length) {
            throw new Error('One or more orderStatusIds are invalid.');
        }

        const createdMappings: RoleAndOrderStatusMapping[] = [];

        for (const orderStatusId of orderStatusIds) {
            const existingMapping =
                await this.prisma.roleAndOrderStatusMapping.findFirst({
                    where: {
                        roleId,
                        orderStatusId,
                    },
                });

            if (existingMapping) {
                throw new Error(
                    `Mapping already exists for roleId ${roleId} and orderStatusId ${orderStatusId}.`
                );
            }

            const createdMapping =
                await this.prisma.roleAndOrderStatusMapping.create({
                    data: {
                        roleId,
                        orderStatusId,
                    },
                });

            createdMappings.push(createdMapping);
        }
        return createdMappings;
    }


    async delete(
        roleAndCapabilityDto: RoleAndOrderStatusDto,
    ): Promise<RoleAndOrderStatusMapping[]> {
        try {
            const { roleId, orderStatusIds } = roleAndCapabilityDto;
            let deletedEntries = [];

            for (const orderStatusId of orderStatusIds) {

                const checkCapability = await this.orderStatusService.findOne(orderStatusId);

                if (!checkCapability) {
                    throw new Error('Invalid capability ID');
                }
                const data = await this.prisma.roleAndOrderStatusMapping.delete({
                    where: {
                        orderStatusId_roleId: { orderStatusId, roleId },
                    },
                });

                deletedEntries.push(data);
            }
            return deletedEntries;
        } catch (error) {
            console.error('Error deleting RoleAndCapabilityMapping:', error);
            throw error;
        }
    }
}
