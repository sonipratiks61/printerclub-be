import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateRoleAndCapabilityDto } from 'src/role-and-capability/dto/role-and-capability.dto';
import { UpdateRoleAndOrderStatusDto } from './dto/role-and-orderStatus.dto';
import { RoleAndCapabilityService } from 'src/role-and-capability/role-and-capability.service';
import { ResponseService } from 'utils/response/customResponse';
import { RoleAndOrderStatusService } from './role-and-order-status.service';

@Controller('role-and-order-status')
export class RoleAndOrderStatusController {
    constructor(
        private readonly roleAndCapabilityService: RoleAndCapabilityService,
        private readonly responseService: ResponseService,
        private readonly roleAndOrderStatusService: RoleAndOrderStatusService
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async updateRoleAndOrderStatus(
        @Body() roleAndOrderStatusDto: UpdateRoleAndOrderStatusDto,
        @Res() res,
    ) {

        try {
            console.log('hy');
            const { roleId, orderStatusToAdd, orderStatusToDelete } = roleAndOrderStatusDto;

            let success = true;

            if (orderStatusToAdd?.length) {
                const created = await this.roleAndOrderStatusService.create({
                    roleId,
                    orderStatusIds: orderStatusToAdd,
                });
                if (!created.length) {
                    success = false;
                    throw new Error('Error while creating new order status mapping');
                }
            }

            if (orderStatusToDelete?.length) {
                const deleted = await this.roleAndOrderStatusService.delete({
                    roleId,
                    orderStatusIds: orderStatusToDelete,
                });

                if (!deleted.length) {
                    success = false;
                    throw new Error('Error while deleting order status mapping');
                }
            }

            return success;
        } catch (error) {
            console.error('Error occurred while updating role and orderStatus:', error);
            return this.responseService.sendInternalError(
                res,
                error.message || 'Something went wrong',
                error,
            );
        }
    }

}

