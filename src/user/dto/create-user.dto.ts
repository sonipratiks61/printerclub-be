import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { CreateAddressDto } from './create-address.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsTenDigitNumber } from 'utils/validation/phoneNumberValidation';

export class CreateUserDto {
  @ApiProperty({
    description: 'The business name of the user',
    example: 'Acme Corp',
  })
  @IsNotEmpty({ message: 'Business Name cannot be empty.' })
  @IsString({ message: 'Business Name must be a string' })
  businessName: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @ApiProperty({
    description: 'The mobile phone number of the user',
    example: '123-456-7890',
  })
  @IsNotEmpty({ message: 'Mobile number must not be empty' })
  @IsString({ message: 'Mobile number must be a string' })
  @IsTenDigitNumber({ message: 'Mobile number must be a 10-digit number' })
  mobileNumber: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'strongPassword123!',
    minLength: 8,
  })
  @MinLength(8)
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  password: string;

  @ApiProperty({
    description: 'The GST number of the user (optional)',
    example: '27AAAAA0000A1Z5',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'GST Number must be a string' })
  gstNumber?: string;

  @ApiProperty({
    description: 'Whether the user accepts terms and conditions',
    example: true,
  })
  @IsNotEmpty({ message: 'Accept Terms must not be empty' })
  @IsBoolean({ message: 'Accept Terms must be Boolean ' })
  acceptTerms: boolean;

  @ApiProperty({
    type: [CreateAddressDto],
    description: 'List of addresses associated with the user',
    isArray: true,
    example: [
      {
        country: 'India',
        state: 'Maharashtra',
        city: 'Mumbai',
        pinCode: '400001',
        address: '101, High street, Near Central Park',
      },
    ],
  })
  @IsNotEmpty({ message: 'Addresses must not be empty.' })
  @ValidateNested({ each: true })
  @IsDefined()
  @Type(() => CreateAddressDto)
  addresses: CreateAddressDto[];
}
