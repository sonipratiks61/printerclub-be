// attachments.controller.ts
import { Controller, Post, UseGuards, Get, Body, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleAndCapabilityService } from './role-and-capability.service';
import { RoleAndCapabilityDto } from './dto/role-and-capability.dto';
import { ResponseService } from 'utils/response/customResponse';

@Controller('roleAndCapability')
export class RoleAndCapabilityController {
  constructor(
    private readonly roleAndCapabilityService: RoleAndCapabilityService,
    private readonly responseService: ResponseService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll(@Res() res) {
    try {
      const data = await this.roleAndCapabilityService.findAll();
      return this.responseService.sendSuccess(res, 'fetch Successfully', data);
    } catch (error) {
      return this.responseService.sendInternalError(
        res,
        error.message || 'something went wrong',
        error,
      );
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createAttachment(
    @Body() roleAndCapabilityDto: RoleAndCapabilityDto,
    @Res() res,
  ) {
    try {
      await this.roleAndCapabilityService.create(roleAndCapabilityDto);
      return this.responseService.sendSuccess(res, 'Created successfully');
    } catch (error) {
      console.error('Error occurred while :', error);
      return this.responseService.sendInternalError(
        res,
        error.message || 'something went wrong',
        error,
      );
    }
  }
}
