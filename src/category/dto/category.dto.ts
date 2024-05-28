import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  type: CategoryType;

  @IsInt()
  parentId: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
