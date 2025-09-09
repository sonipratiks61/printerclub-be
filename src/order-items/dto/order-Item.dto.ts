// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsOptional, IsInt, IsDefined, IsIn } from 'class-validator';
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
    workflowId: number;

    @IsInt()
    @IsNotEmpty()
    gst: number;

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
    measurement: string

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    deliveryDate: string;

    @IsOptional()
    @IsInt()
    @IsNotEmpty()
    discount: number

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemAttributeDto)
    attributes: CreateOrderItemAttributeDto[];

    @ValidateNested()
    @IsOptional()
    @IsDefined()
    @Type(() => CreateAddressDto)
    isMeasurementAddress: CreateAddressDto

    @IsInt()
    @IsOptional()
    isMeasurementAddressId: number

    attachmentId:number

}

export class CreateOrderItemAttributeDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    value: string;

    @IsOptional()
    price: string

    @IsOptional()
    width: string

    @IsOptional()
    height: string
}

export class UpdateOrderItemDto {
    @IsInt()
    statusId: number;

    @IsInt()
    updatedBy:number;
}

export class OrderItemUserDto {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsNumber()
    discount?: number;

    @IsOptional()
    @IsString()
    additionalDetails?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemAttributeDto)
    attributes: CreateOrderItemAttributeDto[];
    
    @IsOptional()
    @IsNumber()
    attachmentId?: number;

    @IsOptional()
    attachmentType: "online" | "email"
}

