import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseService } from 'utils/response/customResponse';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { ProductAttributesService } from './product-attributes.service';
import { CreateProductAttributesDto } from './dto/productAttributes.dto';
import { UpdateProductAttributesDto } from './dto/updateProductAttributes.dto';

@Controller('productAttributes')
export class ProductAttributesController {
  constructor(
    private readonly productAttributesService: ProductAttributesService,
    private readonly responseService: ResponseService,
  ) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))

  async create(
    @Body() createProductAttributesDto: CreateProductAttributesDto[],
    @Req() req,
    @Res() res,
  ) {
    try {
      await this.productAttributesService.createMany(createProductAttributesDto);
      return this.responseService.sendSuccess(
        res,
        'Product Attributes Created Successfully'
      );
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        return this.responseService.sendBadRequest(
          res,
          error.message,
        );
      } 
      else if(error instanceof NotFoundException){
        return this.responseService.sendNotFound(
          res,
          error.message,
        );
      }else {
        return this.responseService.sendInternalError(
          res,
         'Something Went Wrong',
        );
      }
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async fetchAll(@Res() res) {
    try {
      const productAttribute  = await this.productAttributesService.findAll();
      this.responseService.sendSuccess(
        res,
        'Product Attributes Fetched Successfully',
        productAttribute ,
      );
    } catch (error) {
        return this.responseService.sendInternalError(
          res,
          error.message || 'Internal Server Error',
        ); 
    }
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const productAttributeId = parseInt(id, 10);
      const productAttribute = await this.productAttributesService.findOne(productAttributeId);
      if (!productAttribute ) {
        this.responseService.sendNotFound(
          res,
          "productAttribute Id Invalid",
        );
      }
      this.responseService.sendSuccess(res, 'Fetch Successfully', productAttribute);
    } catch (error) {

      this.responseService.sendInternalError(
        res,
        error.message || 'Something Went Wrong',
      );

    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateProductAttributesDto: UpdateProductAttributesDto,
    @Res() res,
  ) {
    try {
      const productAttributeId = parseInt(id, 10);
      const productAttribute = await this.productAttributesService.findOne(productAttributeId);
      if (!productAttribute) {
        this.responseService.sendNotFound(
          res,
          "productAttribute Id Invalid",
        );
      }
      const updatedCategory = await this.productAttributesService.update(
        productAttributeId,
        updateProductAttributesDto,
      );
      this.responseService.sendSuccess(
        res,
        'Product Attributes Updated Successfully',
        updatedCategory,
      );
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      }
      else if (error instanceof BadRequestException) {
        this.responseService.sendBadRequest(res, error.message);
      } else {
        this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong',
        );
      }
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
    const productAttributeId = parseInt(id, 10);
    try {
      const productAttribute = await this.productAttributesService.findOne(productAttributeId);
      if (!productAttribute) {
        this.responseService.sendNotFound(
          res,
          'productAttribute Id Invalid'
        );
      }
      await this.productAttributesService.remove(productAttributeId);
      this.responseService.sendSuccess(
        res,
        'Product Attributes Deleted Successfully',
      );
    } catch (error) {
      console.log(error);
      this.responseService.sendInternalError(
        res,
        error.message || 'Something Went Wrong',
      );

    }
  }
}
