// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsDecimal, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderHistoryDto {
    @IsInt()
    @IsNotEmpty()
    orderItemId:number

    @IsInt()
    @IsNotEmpty()
    statusId:number

    @IsInt()
    @IsNotEmpty()
    updatedById:number

}


