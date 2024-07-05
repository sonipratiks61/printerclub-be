// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemsDto {
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    price: string;

    @IsString()
    additionalDetails: string;

    @IsArray()
    @IsNumber({}, { each: true }) 
    @IsNotEmpty()
    productId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemAttributeDto)
    attributes: CreateOrderItemAttributeDto[];
}

export class CreateOrderItemAttributeDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    value: string; 
}


