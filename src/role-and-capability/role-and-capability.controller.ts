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
import { RoleAndCapabilityService } from './role-and-capability.service';
import { RoleAndCapabilityDto } from './dto/role-and-capability.dto';

@Controller('roleAndCapability')
export class RoleAndCapabilityController {
  constructor(
    private readonly roleAndCapabilityService: RoleAndCapabilityService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll() {
    try {
      return await this.roleAndCapabilityService.findAll();
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
  @UseGuards(AuthGuard('jwt'))
  async createAttachment(@Body() roleAndCapabilityDto: RoleAndCapabilityDto) {
    try {
      await this.roleAndCapabilityService.create(roleAndCapabilityDto);
      return { success: true, message: 'Created Successfully' };
    } catch (error) {
      console.error('Error occurred while :', error);
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
