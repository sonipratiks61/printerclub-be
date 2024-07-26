// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsOptional, IsInt, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/user/dto/create-and-update-address.dto';

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
    address: CreateAddressDto["address"];

    @IsOptional()
    @IsString()
    pinCode: CreateAddressDto["pinCode"];

    @IsOptional()
    @IsString()
    state: CreateAddressDto["state"];

    @IsOptional()
    @IsString()
    country: CreateAddressDto["country"];

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

    @ValidateNested()
    @IsOptional()
    @IsDefined()
    @Type(() => CreateAddressDto)
    isMeasurementAddress:CreateAddressDto

    @IsInt()
    @IsOptional()
    isMeasurementAddressId:number
}

export class CreateOrderItemAttributeDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    value: string; 
}


