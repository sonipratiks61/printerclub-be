// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsDecimal, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
    @IsInt()
    @IsNotEmpty()
    orderHistoryId: number;

    @IsInt()
    @IsNotEmpty()
    orderCustomerId: number;

    @IsInt()
    @IsNotEmpty()
    orderItemId: number;

    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'AdvancePayment must be a number' })
    @IsNotEmpty()
    advancePayment: number;

    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'RemainingPayment must be a number' })
    @IsNotEmpty()
    remainingPayment: number;

    @IsString()
    @IsNotEmpty()
    GST:string;

    @IsInt()
    @IsNotEmpty()
    discount: number;

    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'TotalPayment must be a number' })
    @IsNotEmpty()
    totalPayment: number;

    @IsString()
    invoiceVarient:string

    

}


