import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsInt,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubCategoryDto } from './subcategory.dto'; // Adjust the import path as needed

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Type cannot be empty' })
  @IsString({ message: 'Type must be a string' })
  type: string;

  @IsOptional()
  @IsInt({ message: 'Parent Id must be a number' })
  parentId?: number;
  
  @IsOptional()
  @IsInt({ message: 'Parent Id must be a number' })
  attachmentId:number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubCategoryDto)
  @IsDefined()
  subCategories?: CreateSubCategoryDto[];
}
