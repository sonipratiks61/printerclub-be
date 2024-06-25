import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttributeType } from '@prisma/client';

export class CreateProductAttributesDto {
  @ApiProperty({
    description: 'The product name of the order',
    example: 'Acme Corp',
  })
  @IsNotEmpty({ message: 'Product Name cannot be empty.' })
  @IsString({ message: 'Product Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Quantity type',
    example: 'text',
  })
 
  @IsNotEmpty({ message: 'Type cannot be empty.' })
  @IsIn(['text', 'dropDown'], { message: 'Type must be either text or dropDown' })
  type: AttributeType;

  @ApiProperty({
    description: 'ID of the product the productAttributes belongs to',
    example: 1,
    required: false,
  })
  @IsNotEmpty({ message: 'Type cannot be empty.' })
  @IsInt({ message: 'Type must be a integer' })
  productId?: number;

  @IsOptional()
  @IsArray({ message: 'Options must be an array' })
  @ArrayNotEmpty({ message: 'Options array must not be empty' })
  options?: string[]
}
