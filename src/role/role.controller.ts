// attachments.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Res,
  Param,
  NotFoundException,
  Delete,
  Patch,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
// import { RoleService } from './role.service';
import { ResponseService } from 'utils/response/customResponse';
import { RoleService } from './role.service';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { RoleAndCapabilityController } from 'src/role-and-capability/role-and-capability.controller';
import { RoleAndOrderStatusController } from 'src/role-and-order-status/role-and-order-status.controller';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly responseService: ResponseService,
    private readonly roleAndCapabilityController: RoleAndCapabilityController,
    private readonly roleAndOrderStatusController: RoleAndOrderStatusController
  ) { }

  @Get()
  async fetchAll(@Res() res) {
    try {
      const data = await this.roleService.findAll();
      this.responseService.sendSuccess(res, 'Fetch Successfully!', data);
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
        error,
      );
    }
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully created.',
    type: CreateRoleDto,
  })
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res) {
    try {
      const data = await this.roleService.findByName(createRoleDto.name);
      if (data) {
        this.responseService.sendBadRequest(
          res,
          'This Role Name is already exist',
        );
      } else {
        const data = await this.roleService.create(createRoleDto);
        if (data) {
          this.responseService.sendSuccess(res, 'Role Create Successfully');
        } else {
          this.responseService.sendBadRequest(res, 'Failed to Role Create');
        }
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      } else {
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
          error,
        );
      }
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const roleId = parseInt(id, 10);
      const role = await this.roleService.findOne(roleId);
      if (!role) {
        this.responseService.sendNotFound(res, 'Invalid Role Id ');
      }
      if (role) {
        this.responseService.sendSuccess(res, 'Role Fetch Successfully', role);
      } else {
        this.responseService.sendBadRequest(res, 'Failed to  Role Fetch');
      }
    } catch (error) {
      this.responseService.sendInternalError(res, 'Something Went Wrong');
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
    const roleId = parseInt(id, 10);
    try {
      const role = await this.roleService.findOne(roleId);
      if (!role) {
        this.responseService.sendNotFound(res, 'Invalid Role Id');
      }
      const data = await this.roleService.delete(roleId);
      if (data) {
        this.responseService.sendSuccess(res, 'Role Deleted Successfully');
      } else {
        this.responseService.sendBadRequest(res, 'Failed to Role Delete');
      }
    } catch (error) {
      this.responseService.sendInternalError(res, 'Something Went Wrong');
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateRole(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res,
  ) {
    try {
      const roleId = parseInt(id, 10);
      const { name, capabilityIds, orderStatusIds } = updateRoleDto;

      const role = await this.roleService.findOne(roleId);

      if (!role) {
        this.responseService.sendNotFound(res, 'Invalid role ID!');
      }

      let existingCapabilities = role.capabilityIds.map((cap, index) => {
        return cap.capability.id;
      });
      let existingOrderStatus = role.orderStatusIds.map((ord, index) => {
        return ord.orderStatus.id;
      })

      const capabilitiesToAdd = capabilityIds.filter(
        (id) => !existingCapabilities.includes(id),
      );

      const capabilitiesToDelete = existingCapabilities.filter(
        (id) => !capabilityIds.includes(id),
      );

      const orderStatusToDelete = existingOrderStatus.filter(
        (id) => !existingOrderStatus.includes(id),
      );
      const orderStatusToAdd = orderStatusIds.filter((id) => !existingOrderStatus.includes(id),);

      const updatedCapabilities =
        await this.roleAndCapabilityController.updateRoleAndCapabilities(
          { roleId, capabilitiesToAdd, capabilitiesToDelete },
          res,
        );
      const updatedOrderStatus = await this.roleAndOrderStatusController.updateRoleAndOrderStatus({ roleId, orderStatusToAdd, orderStatusToDelete }, res);
      const updatedRole = await this.roleService.updateRoleName(roleId, name);

      if (!updatedRole || !updatedCapabilities || !updatedOrderStatus) {
        this.responseService.sendInternalError(res, 'Something Went Wrong');
      }

      this.responseService.sendSuccess(
        res,
        'Role Updated Successfully',
        updatedRole,
      );
    } catch (error) {
      if (error instanceof ConflictException) {
        this.responseService.sendConflict(res, error.message);
      }
      this.responseService.sendInternalError(res, 'Something Went Wrong');
    }
  }
}
