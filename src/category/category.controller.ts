import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  Req,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req,
  ): Promise<{ success: boolean; message: string; statusCode: number }> {
    const userId = req.user.id; // Access req.user.id from the request object
    try {
      await this.categoryService.create(createCategoryDto, userId);
      return {
        success: true,
        message: 'Category created successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access this route
  async fetchAll() {
    try {
      return await this.categoryService.findAllCategories();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem accessing data',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    try {
      const categoryId = parseInt(id, 10);
      const category = await this.categoryService.findOne(categoryId);
      if (!category) {
        throw new NotFoundException('Invalid CategoryId');
      }
      return {
        status: HttpStatus.OK,
        message: 'Fetch Successfully ',
        data: category,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'There was a problem accessing data',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const categoryId = parseInt(id, 10);
      const category = await this.categoryService.findOne(categoryId);
      if (!category) {
        throw new NotFoundException('Invalid CategoryId');
      }
      const updatedCategory = await this.categoryService.update(
        categoryId,
        updateCategoryDto,
      );
      return {
        status: HttpStatus.OK,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'There was a problem accessing data',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const categoryId = parseInt(id, 10);
    try {
      const category = await this.categoryService.findOne(categoryId);
      if (!category) {
        throw new NotFoundException('Invalid CategoryId');
      }
      await this.categoryService.remove(categoryId);
      return {
        status: HttpStatus.OK,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'There was a problem accessing data',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
