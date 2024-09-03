// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsDecimal, IsInt, IsDefined, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemsDto } from 'src/order-items/dto/order-Item.dto';
import { CreateCustomerDetailsDto } from 'src/customer-details/dto/customer-details.dto';

export class CreateOrderDto {

    @IsOptional()
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'AdvancePayment must be a number' })
    advancePayment: number;

    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'RemainingPayment must be a number' })
    @IsNotEmpty()
    remainingPayment: number;

    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'TotalPayment must be a number' })
    @IsNotEmpty()
    totalPayment: number;

    @IsNotEmpty()
    paymentMode: string

    @IsNotEmpty({ message: 'OrderItems must not be empty.' })
    @ValidateNested({ each: true })
    @IsDefined()
    @Type(() => CreateOrderItemsDto)
    orderItems: CreateOrderItemsDto[]

    @IsNotEmpty({ message: 'CustomerDetails must not be empty.' })
    @ValidateNested()
    @IsDefined()
    @IsOptional()
    @Type(() => CreateCustomerDetailsDto)
    customerDetails: CreateCustomerDetailsDto

    


}

export class OrderUserDto {

   
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'TotalPayment must be a number' })
    @IsNotEmpty()
    totalPayment: number;

    @IsNotEmpty()
    paymentMode: string

    @IsNotEmpty({ message: 'OrderItems must not be empty.' })
    @ValidateNested({ each: true })
    @IsDefined()
    @Type(() => OrderItemUserDto)
    orderItems: OrderItemUserDto[]

    @IsNotEmpty({ message: 'CustomerDetails must not be empty.' })
    @ValidateNested()
    @IsDefined()
    @IsOptional()
    @Type(() => CreateCustomerDetailsDto)
    customerDetails: CreateCustomerDetailsDto

    


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
    @IsNumber()
    attachmentId?: number;
    
}
