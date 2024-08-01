// CreateOrderItemsDto.ts
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsArray, IsOptional, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderStatusDto {

    @IsString()
    @IsNotEmpty()
    status:string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsInt()
    @IsNotEmpty()
    dependOn: number

}
export class UpdateOrderStatusDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    status:string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsInt()
    @IsNotEmpty()
    dependOn: number

}



