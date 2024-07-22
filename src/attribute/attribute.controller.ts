import { Body, ConflictException, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { ResponseService } from 'utils/response/customResponse';
import { AuthGuard } from '@nestjs/passport';
import { CreateAddressDto } from 'src/user/dto/create-and-update-address.dto';
import { CreateAttributeDto } from './dto/attribute.dto';
import { IdValidationPipe } from 'utils/validation/paramsValidation';

@Controller('attribute')
export class AttributeController {
  constructor(
    private readonly attributeService: AttributeService,
    private readonly responseService: ResponseService, // Inject the ResponseService
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createAttribute(
    @Body() createAttributeDto: CreateAttributeDto,
    @Req() req,
    @Res() res) {
    try {
      const data = await this.attributeService.create(createAttributeDto);
      if (data) {
        this.responseService.sendSuccess(res, "Attribute created Successfully");
      }
      else {
        this.responseService.sendBadRequest(res, "Failed to create attribute");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof (ConflictException)) {
        this.responseService.sendConflict(res, error.message);
      }
      else {
        this.responseService.sendInternalError(
          res,
          'Something went wrong',
          error,
        );

      }
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getAttributeById(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const attributeId = parseInt(id, 10)
      const data = await this.attributeService.findOne(attributeId);
      if (!data) {
        this.responseService.sendNotFound(res, "Invalid Attribute Id ")
      }
      this.responseService.sendSuccess(res, "Fetch Attribute Successfully", data);
    } catch (error) {
      this.responseService.sendInternalError(res, 'Something went wrong', error)
    }

  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAllAttribute(@Res() res) {
    try {
      const data = await this.attributeService.findAllAttribute();
      this.responseService.sendSuccess(
        res,
        'Attribute retrieved successfully',
        data,
      );
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        'Something went wrong',
        error,
      );
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateAttribute(@Param('id', IdValidationPipe) id: string, @Res() res, @Body() createAttributeDto: CreateAttributeDto) {
    try {
      const attributeId = parseInt(id, 10)
      const attribute = await this.attributeService.findOne(attributeId);
      if (!attribute) {
        this.responseService.sendNotFound(res, "Invalid Attribute Id ")
      }

      const data = await this.attributeService.update(attributeId, createAttributeDto);
      if(data)
      {this.responseService.sendSuccess(res, "Update Attribute Successfully", data);
    }
    else {
      this.responseService.sendBadRequest(res, "Failed to Update Attribute");
    }

    }
    catch (error) {
      this.responseService.sendInternalError(res, "Something went wrong", error)
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteAttribute(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const attributeId = parseInt(id, 10)
      const attribute = await this.attributeService.findOne(attributeId);
      if (!attribute) {
        this.responseService.sendNotFound(res, "Invalid Attribute Id ")
      }
      await this.attributeService.delete(attributeId)
      this.responseService.sendSuccess(res, 'Attribute Deleted Successfully');
    } catch (error) {
      console.error(error);

      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
      );
    }
  }
}


