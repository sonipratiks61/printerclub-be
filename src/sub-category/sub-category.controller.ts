import {
  Controller,
  Get,
  NotFoundException,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseService } from 'utils/response/customResponse';
import { SubCategoryService } from './sub-category.service';

@Controller('subCategory')
export class SubCategoryController {
  constructor(
    private readonly categoryService: SubCategoryService,
    private readonly responseService: ResponseService,
  ) { }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findSubCategories(@Query('parentId') parentId: string, @Res() res, @Req() req) {
    try {
      const searchParentId = parseInt(parentId, 10);
      const search = req.query?.search
      const subCategory =
        await this.categoryService.searchSubCategories(searchParentId, search);
      return this.responseService.sendSuccess(
        res,
        'Fetch SubCategory Successful',
        subCategory,
      );
    } catch (error) {
      return this.responseService.sendInternalError(
        res,
        error.message,
      );
    }
  }
}

