import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { ResponseService } from 'utils/response/customResponse';
import { AuthGuard } from '@nestjs/passport';

@Controller('attribute')
export class AttributeController {
  constructor(
    private readonly attributeService: AttributeService,
    private readonly responseService: ResponseService, // Inject the ResponseService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAllAttribute(@Res() res) {
    try {
      const data = await this.attributeService.findAllAttribute();
      return this.responseService.sendSuccess(
        res,
        'Attribute retrieved successfully',
        data,
      );
    } catch (error) {
      return this.responseService.sendInternalError(
        res,
        'Something went wrong',
        error,
      );
    }
  }
}
