import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  IsDefined,
  IsOptional,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttributeType } from '@prisma/client';
import { Type } from 'class-transformer';

class QuantityRange {
  @ApiProperty({
    description: 'Quantity type',
    example: 'text',
  })
  @IsOptional()
  @IsIn(['text', 'dropDown'], { message: 'Quantity type must be either text or dropDown' })
  type: AttributeType;

  @ApiProperty({
    description: 'Minimum quantity',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Minimum quantity must be an integer' })
  @Min(1, { message: 'Minimum quantity must be at least 1' })
  min?: number;

  @ApiProperty({
    description: 'Maximum quantity',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Maximum quantity must be an integer' })
  @Min(0, { message: 'Maximum quantity must be at least 0' })
  max?: number;

  @ApiProperty({
    description: 'Array of quantity option for dropDown type',
    example: [1, 2, 3, 4, 5],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Quantity option must be an array' })
  @ArrayNotEmpty({ message: 'Quantity option array must not be empty' })
  @IsInt({ each: true, message: 'Each quantity value must be an integer' })
  options?: number[];
}
export class UpdateProductDto {
  @ApiProperty({
    description: 'The name of the order',
    example: 'Acme Corp',
  })
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'High-quality widget from Acme Corp.',
  })
  @IsNotEmpty({ message: 'Description cannot be empty.' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    description: 'Quantity range or value based on product type',
    required: true,
  })
  @IsOptional()
  @IsDefined({ message: 'Quantity must be defined' })
  @ValidateNested()
  @Type(() => QuantityRange)
  quantity: QuantityRange;

  @ApiProperty({
    description: 'Amount payable for the product',
    example: '100.00',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Price must not be empty' })
  @IsString({ message: 'Price must be a string' })
  price: string;

  @ApiProperty({
    description: 'ID of the category the product belongs to',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Category Id cannot be empty.' })
  @IsInt({ message: 'Category Id must be a integer' })
  categoryId?: number;

  @IsOptional()
  @IsArray()
  attachmentId?: number[];

  @ApiProperty({
    description: 'ID of the workFlow the product belongs to',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'WorkFlow Id cannot be empty.' })
  @IsInt({ message: 'WorkFlow Id must be a integer' })
  workFlowId?: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty({ message: 'Gst cannot be empty.' })
  @IsInt({ message: 'Gst must be a integer' })
  gst: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Discount cannot be empty.' })
  discount?: number;

  @ApiProperty({
    description: 'Indicates if a measurement is required',
    example: true,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'RequiredMeasurement cannot be empty.' })
  @IsBoolean({ message: 'RequiredMeasurement must be a boolean' })
  isMeasurementRequired : boolean;

  @ApiProperty({
    description: 'Indicates if a measurement is required',
    example: true,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Required Fitment cannot be empty.' })
  @IsBoolean({ message: 'Required Fitment must be a boolean' })
  isFitmentRequired : boolean;

}
