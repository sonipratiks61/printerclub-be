import { IsNotEmpty, IsString, IsOptional, IsInt, IsIn, IsEnum, ArrayNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttributeType } from '@prisma/client';

export class UpdateProductAttributesDto {
  @ApiProperty({
    description: 'The product name of the order',
    example: 'Acme Corp',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Attribute Name cannot be empty.' })
  @IsInt({ message: 'Attribute Name must be a integer' })
  attributeId: number;

  @ApiProperty({
    description: 'Quantity type',
    example: 'text',
  })
  @IsNotEmpty({ message: 'Type cannot be empty.' })
  @IsIn(['text', 'dropDown'], { message: 'Type must be either text or dropDown' })
  @IsOptional()
  type: AttributeType;

  @ApiProperty({
    description: 'ID of the product the productAttributes belongs to',
    example: 1,
    required: false,
  })
  @IsNotEmpty({ message: 'Type cannot be empty.' })
  @IsInt({ message: 'Type must be a integer' })
  @IsOptional()
  productId?: number;

  @IsOptional()
  @IsArray({ message: 'Options must be an array' })
  @ArrayNotEmpty({ message: 'Options array must not be empty' })
  options?: string[];

  @IsOptional()
  price?: string;
}
