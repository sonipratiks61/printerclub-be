// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsDecimal, IsInt, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemsDto } from 'src/order-items/dto/create-order-Item.dto';
import { CreateCustomerDetailsDto } from 'src/customer-details/dto/customer-details.dto';

export class CreateOrderDto {

    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'AdvancePayment must be a number' })
    @IsNotEmpty()
    advancePayment: number;

    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'RemainingPayment must be a number' })
    @IsNotEmpty()
    remainingPayment: number;

    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'TotalPayment must be a number' })
    @IsNotEmpty()
    totalPayment: number;

    paymentMode: string
    @IsNotEmpty({ message: 'Addresses must not be empty.' })
    @ValidateNested({ each: true })
    @IsDefined()
    @Type(() => CreateOrderItemsDto)
    orderItems: CreateOrderItemsDto[]

    customerDetails: CreateCustomerDetailsDto



}


