import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { CreateAddressDto } from './create-address.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The business name of the user',
    example: 'Acme Corp',
  })
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The mobile phone number of the user',
    example: '123-456-7890',
  })
  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'strongPassword123!',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'The GST number of the user (optional)',
    example: '27AAAAA0000A1Z5',
    required: false,
  })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiProperty({
    description: 'Whether the user accepts terms and conditions',
    example: true,
  })
  @IsNotEmpty()
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
  addresses: CreateAddressDto[];
}
