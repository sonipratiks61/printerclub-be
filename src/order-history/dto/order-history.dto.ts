// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsDecimal, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderHistoryDto {
    @IsInt()
    orderItemId:number

    @IsInt()
    statusId:number

}


