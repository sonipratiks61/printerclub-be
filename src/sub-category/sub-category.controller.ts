import {
  Controller,
  Get,
  NotFoundException,
  Query,
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
  ) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findParentCategories(@Query('parentId') parentId: string, @Res() res) {
    try {
      const searchParentId = parseInt(parentId, 10);

      const categories =
        await this.categoryService.findParentCategories(searchParentId);

      return this.responseService.sendSuccess(
        res,
        'Fetch SubCategory Successful',
        categories,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return this.responseService.sendNotFound(res, error.message);
      } else {
        return this.responseService.sendInternalError(
          res,
          error.message,
          error,
        );
      }
    }
  }
}
