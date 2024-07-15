import {
  Controller,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Body,
  Delete,
  Param,
  Put,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CapabilityService } from './capability.service';
import { UpdateCategoryDto } from 'src/category/dto/update.category.dto';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { ResponseService } from 'utils/response/customResponse';
import { CreateCapabilityDto } from './dto/capabilities.dto';
@Controller('capability')
export class CapabilityController {
  constructor(
    private readonly capabilityService: CapabilityService,
    private readonly responseService: ResponseService,
  ) { }

  @Post()
  async create(@Body() createCapabilitiesDto: CreateCapabilityDto, @Res() res) {
    try {
      const data = await this.capabilityService.create(createCapabilitiesDto);
      if (data) {
        this.responseService.sendSuccess(res, "Capability Created Successfully");
      }
      else {
        this.responseService.sendBadRequest(res, "Capability Not Created");
      }
    } catch (error) {
      console.error(error);

      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
      );

    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll(
    @Res() res
  ) {
    try {
      const data = await this.capabilityService.findAll();
      if (data && data.length > 0) {
        this.responseService.sendSuccess(res, "Capabilities Fetched Successfully", data);
      }
      else {
        this.responseService.sendBadRequest(res, 'No Capabilities Found')
      }
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
      );

    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const capabilityId = parseInt(id, 10);
      const capability = await this.capabilityService.findOne(capabilityId);
      if (!capability) {
        this.responseService.sendNotFound(
          res,
          "Invalid Capability Id",
        );
      }
      this.responseService.sendSuccess(res, 'Fetch Successfully', capability);
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
      );
      return;
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res,
  ) {
    try {
      const capabilityId = parseInt(id, 10);
      const capability = await this.capabilityService.findOne(capabilityId);
      if (!capability) {
        this.responseService.sendNotFound(
          res,
          'Invalid Capability Id',
        );
      }
      const updatedCategory = await this.capabilityService.update(
        capabilityId,
        updateCategoryDto,
      );
      this.responseService.sendSuccess(
        res,
        'Capability Updated Successfully',
        updatedCategory,
      );
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',

      );

    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
    const capabilityId = parseInt(id, 10);
    try {
      const capability = await this.capabilityService.findOne(capabilityId);
      if (!capability) {
        this.responseService.sendNotFound(
          res,
          'Invalid Capability Id',
        );
      }
      await this.capabilityService.delete(capabilityId);
      this.responseService.sendSuccess(res, 'Capability Deleted Successfully');
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
      );
    }
  }
}
