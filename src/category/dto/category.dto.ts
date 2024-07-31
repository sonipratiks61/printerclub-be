import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubCategoryDto } from './subcategory.dto'; // Adjust the import path as needed

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Type cannot be empty' })
  @IsString({ message: 'Type must be a string' })
  type: string;

  @IsOptional()
  @IsInt({ message: 'Parent Id must be a number' })
  parentId: number | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubCategoryDto)
  subCategories?: CreateSubCategoryDto[];
}
