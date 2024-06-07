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
      this.responseService.sendSuccess(res, 'Fetch Successfully', data);
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        error.message || 'Something Went Wrong',
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
      this.responseService.sendSuccess(res, 'Created Successfully');
    } catch (error) {
      console.error('Error occurred while :', error);
      this.responseService.sendInternalError(
        res,
        error.message || 'Something Went Wrong',
        error,
      );
    }
  }
}
