import { IsString, IsOptional, IsNotEmpty, IsInt } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Description cannot be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Type cannot be empty' })
  @IsString({ message: 'Type must be a string' })
  type: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Type cannot be empty' })
  @IsInt({ message: 'Type must be a number' })
  parentId: number;
}
