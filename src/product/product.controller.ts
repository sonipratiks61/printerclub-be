import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
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
  ) { }

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
      if (data) {
        this.responseService.sendSuccess(res, 'Product Created Successfully', data
        );
      }
      else {
        this.responseService.sendBadRequest(res, 'Product Not Created')
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.responseService.sendBadRequest(res, error.message);
      } else if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
        return;
      } else {
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
          error,
        );
        return;
      }
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findProductByCategoryId(@Res() res,  @Req() req, @Query('categoryId') categoryId?: string) {
    try {
      let data;
      const category = parseInt(categoryId, 10)
      const userId = req.user.id;
      const search = req.query?.search

      if (category) {
        data = await this.productService.findProductByCategoryId(category, userId);
        this.responseService.sendSuccess(res, 'Products fetched successfully by subCategory', data);
      } else {
        data = await this.productService.findAll(search);
        this.responseService.sendSuccess(res, 'Products fetched successfully', data);
      }

    } catch (error) {
      if (error instanceof BadRequestException) {
        this.responseService.sendBadRequest(res, error.message);
      }
      else if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      } else {
        this.responseService.sendInternalError(
          res,
          error.message || 'Something went wrong',
          error,
        );
      }
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const productId = parseInt(id, 10);
      const product = await this.productService.findOne(productId);
      this.responseService.sendSuccess(res, ' Product Fetch Successfully', product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(
          res,
          'Product not Found',
        );
      }
      else {
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
          error,
        );

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
      const product = await this.productService.findOne(productId);
      if (!product) {
        this.responseService.sendNotFound(
          res,
          "Product not Found",
        );
      }
      const data = await this.productService.update(
        productId,
        updateProductDto,
      );
      if (data) {
        this.responseService.sendSuccess(
          res,
          'Product Updated Successfully',
          data,
        );
      }
      else {
        this.responseService.sendBadRequest(res, ' Failed to Product Updated')

      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.responseService.sendBadRequest(res, error.message, error);
      } else if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
        return;
      } else {
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
          error,
        );
        return;
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
          'Product not Found'
        );
      }
      const data = await this.productService.remove(productId);
      if (data) {
        this.responseService.sendSuccess(res, 'Product Deleted Successfully');
      }
      else {
        this.responseService.sendBadRequest(res, 'Failed to Product Deleted');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      } else {
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
          error,
        );
      }
    }
  }
}
