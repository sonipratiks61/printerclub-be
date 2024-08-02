// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsOptional, IsInt, IsDefined, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/user/dto/create-and-update-address.dto';
import { OrderItemStatusType } from '@prisma/client';

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
    workflowId: number;

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
    city: CreateAddressDto["city"];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    measurement:string

    @IsString()
    @IsNotEmpty()
    description: string;

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

export class UpdateOrderItemDto{
    @IsIn(['cancelled', 'confirmed','pending'], { message: 'Order item status must be either cancel or confirm' })
    orderItemStatus:  OrderItemStatusType;
}

