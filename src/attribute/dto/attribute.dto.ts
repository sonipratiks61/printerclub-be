import {
    IsString,
    IsOptional,
    ValidateNested,
    IsNotEmpty,
    IsInt,
    IsBoolean,
  } from 'class-validator';
  
  export class CreateAttributeDto {
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @IsString({ message: 'Name must be a string' })
    name: string;  

    @IsOptional()
    @IsBoolean()
    showToUser: boolean
  }
  