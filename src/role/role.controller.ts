// attachments.controller.ts
import { Controller, Post, UseGuards, Get, Body, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { ResponseService } from 'utils/response/customResponse';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly responseService: ResponseService, // Inject the ResponseService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll(@Res() res) {
    try {
      const data = await this.roleService.findAll();
      return this.responseService.sendSuccess(res, 'fetch successfully!', data);
    } catch (error) {
      return this.responseService.sendInternalError(
        res,
        error.message || 'something went wrong',
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
  async createAttachment(@Body() createRoleDto: CreateRoleDto, @Res() res) {
    try {
      await this.roleService.createRole(createRoleDto);
      this.responseService.sendSuccess(res, 'Create Successfully');
      return;
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        error.message || 'something went wrong',
        error,
      );
    }
  }
}
