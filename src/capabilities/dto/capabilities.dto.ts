import {
    IsString,
    IsNotEmpty,
    ArrayNotEmpty,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
 export class CreateCapabilityDto {
    @IsString({message:"Name must be String"})
    @IsNotEmpty({message:"Name cannot be Empty"})
    name: string;
  }
  