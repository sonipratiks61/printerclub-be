import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  IsDefined,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttributeType } from '@prisma/client';

class QuantityRange {
  @ApiProperty({
    description: 'Quantity type',
    example: 'text',
  })
  @IsIn(['text', 'dropDown'], { message: 'Quantity type must be either text or dropDown' })
  type: AttributeType;

  @ApiProperty({
    description: 'Minimum quantity',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Minimum quantity must be an integer' })
  min?: number;

  @ApiProperty({
    description: 'Maximum quantity',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Maximum quantity must be an integer' })
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

export class CreateProductDto {
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
  @IsDefined({ message: 'Quantity must be defined' })
  @ValidateNested()
  @Type(() => QuantityRange)
  quantity: QuantityRange;

  @ApiProperty({
    description: 'Price for the product',
    example: '100.00',
  })
  @IsNotEmpty({ message: 'Price must not be empty' })
  @IsString({ message: 'Price must be a string' })
  price: string;

  @ApiProperty({
    description: 'ID of the category the product belongs to',
    example: 1,
    required: false,
  })
  @IsNotEmpty({ message: 'Category Id cannot be empty.' })
  @IsInt({ message: 'Category Id must be a integer' })
  categoryId?: number;


  @ApiProperty({
    description: 'ID of the Attachment Id should be Array',
    example: [1],
    required: false,
  })

  @IsOptional()
  @IsArray({ message: 'AttachmentIds must be an array' })
  @IsInt({ each: true, message: 'Each AttachmentId must be an integer' })
  attachmentId?: number[];
  
  @ApiProperty({
    description: 'ID of the workFlow the product belongs to',
    example: 1,
    required: false,
  })
  @IsNotEmpty({ message: 'WorkFlow Id cannot be empty.' })
  @IsInt({ message: 'WorkFlow Id must be a integer' })
  workflowId?: number;

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
  @IsInt({ message: 'Discount must be a integer' })
  discount?: number;

  @ApiProperty({
    description: 'Indicates if a fitment is required',
    example: true,
  })
  @IsNotEmpty({ message: 'RequiredMeasurement cannot be empty.' })
  @IsBoolean({ message: 'RequiredMeasurement must be a boolean' })
  isMeasurementRequired : boolean;

  @ApiProperty({
    description: 'Indicates if a measurement is required',
    example: true,
  })
  @IsNotEmpty({ message: 'Required Fitment cannot be empty.' })
  @IsBoolean({ message: 'Required Fitment must be a boolean' })
  isFitmentRequired : boolean;

}






 

