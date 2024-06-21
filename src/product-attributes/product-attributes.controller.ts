import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
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
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createProductAttributesDto: CreateProductAttributesDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      // Access req.user.id from the request object
      await this.productAttributesService.create(createProductAttributesDto);
      this.responseService.sendSuccess(
        res,
        'Product Attributes Created Successfully',
      );
    } catch (error) {
      console.error(error);
      this.responseService.sendBadRequest(
        res,
        error.message||'Something Went Wrong',
        error,
      );
    }
  }
  @Get()
  @UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access this route
  async fetchAll(@Res() res) {
    try {
      const categories = await this.productAttributesService.findAll();
      this.responseService.sendSuccess(
        res,
        'Product Attributes Fetched Successfully',
        categories,
      );
    } catch (error) {
      this.responseService.sendBadRequest(
        res,
        error.message||'Something Went Wrong',
        error.message,
      );
    }
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const productId = parseInt(id, 10);
      const product = await this.productAttributesService.findOne(productId);
      if (!product) {
        this.responseService.sendNotFound(
          res,
          `Product with ID ${id} not found`,
        );
      }
      this.responseService.sendSuccess(res, 'Fetch Successfully', product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
        return;
      } else {
        this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong',
          error,
        );
        return;
      }
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
      const productId = parseInt(id, 10);
      const product = await this.productAttributesService.findOne(productId);
      if (!product) {
        this.responseService.sendNotFound(
          res,
          `Product with ID ${id} not found`,
        );
      }
      const updatedCategory = await this.productAttributesService.update(
        productId,
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
      } else {
        this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong',
          error,
        );
      }
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
    const productId = parseInt(id, 10);
    try {
      const product = await this.productAttributesService.findOne(productId);
      if (!product) {
        this.responseService.sendNotFound(
          res,
          `Category with ID ${id} not found`,
        );
      }
      await this.productAttributesService.remove(productId);
      this.responseService.sendSuccess(
        res,
        'Product Attributes Deleted Successfully',
      );
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      } else {
        this.responseService.sendInternalError(
          res,
          error.message||'Something Went Wrong',
          error,
        );
      }
    }
  }
}
