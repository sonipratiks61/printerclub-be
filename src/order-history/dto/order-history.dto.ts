// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderHistoryDto {
   @IsString()
    status:string

}


