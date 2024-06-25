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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product.dto';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const userId = req.user.id; 
     const data = await this.productService.create(createProductDto, userId);
      this.responseService.sendSuccess(res, 'Product Created Successfully',data
      );
    } catch (error) {
      this.responseService.sendBadRequest(res, error.message||'Something Went Wrong', error);
    }
  }
  @Get()
  @UseGuards(AuthGuard('jwt')) 
  async fetchAll(@Res() res) {
    try {
      const categories = await this.productService.findAll();
      this.responseService.sendSuccess(
        res,
        'Product Fetched Successfully',
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
      const categoryId = parseInt(id, 10);
      const category = await this.productService.findOne(categoryId);
      if (!category) {
        this.responseService.sendNotFound(
          res,
          `Category with ID ${id} not found`,
        );
      }
      this.responseService.sendSuccess(res, 'Fetch Successfully', category);
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
    @Body() updateProductDto: UpdateProductDto,
    @Res() res,
  ) {
    try {
      const productId = parseInt(id, 10);
      const category = await this.productService.findOne(productId);
      if (!category) {
        this.responseService.sendNotFound(
          res,
          `Category with ID ${id} not found`,
        );
      }
      const updatedCategory = await this.productService.update(
        productId,
        updateProductDto,
      );
      this.responseService.sendSuccess(
        res,
        'Product Updated Successfully',
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
      const product = await this.productService.findOne(productId);
      if (!product) {
        this.responseService.sendNotFound(
          res,
          `Category with ID ${id} not found`,
        );
      }
      await this.productService.remove(productId);
      this.responseService.sendSuccess(res, 'Category Deleted Successfully');
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
