import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { CreateAddressDto } from './create-address.dto';

export class CreateUserDto {
  @IsNotEmpty({ message: 'businessName cannot be empty.' })
  @IsString({ message: 'businessName must be a string' })
  businessName: string;

  @IsNotEmpty({ message: 'name cannot be empty.' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Mobile number must not be empty' })
  @IsString({ message: 'Mobile number must be a string' })
  mobileNumber: string;

  @MinLength(8)
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  password: string;

  @IsOptional()
  @IsString()
  gstNumber?: string;

  @IsNotEmpty()
  acceptTerms: boolean;

  addresses: CreateAddressDto[];
}
