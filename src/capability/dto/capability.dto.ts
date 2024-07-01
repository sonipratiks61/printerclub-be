import {
    IsString,
    IsNotEmpty,
    ArrayNotEmpty,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
 export class CreateCapabilityDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  }
  