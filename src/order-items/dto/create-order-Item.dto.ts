// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsOptional, IsInt } from 'class-validator';
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

    @IsOptional()
    @IsString()
    additionalDetails: string;

    @IsInt()
    @IsNotEmpty()
    productId: number;

    @IsInt()
    @IsNotEmpty()
    gst:number;

    @IsOptional()
    @IsString()
    address:string

    @IsOptional()
    @IsString()
    pinCode:string

    @IsOptional()
    @IsString()
    state:string

    @IsOptional()
    @IsString()
    country:string

    @IsOptional()
    @IsString()
    city:string

    @IsOptional()
    @IsString()
    measurement:string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsOptional()
    @IsInt()
    @IsNotEmpty()
    discount:number
    
    @IsOptional()
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


