// attachments.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll() {
    try {
      return await this.roleService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'There was a problem accessing data',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully created.',
    type: CreateRoleDto,
  })
  async createAttachment(@Body() createRoleDto: CreateRoleDto) {
    try {
      await this.roleService.createRole(createRoleDto);
      return { success: true, message: 'create Successfully' };
    } catch (error) {
      console.error('Error occurred while:', error);
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
