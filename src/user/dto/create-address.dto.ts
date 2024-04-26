import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsPostalCode } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'The country where the user resides',
    example: 'United States',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'The state or province where the user resides',
    example: 'California',
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: 'The city where the user resides',
    example: 'San Francisco',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: "The postal code of the user's address",
    example: '94103',
  })
  @IsPostalCode()
  @IsNotEmpty()
  pinCode: string;

  @ApiProperty({
    description:
      'The full address line including street name, building number, etc.',
    example: '123 Main St, Apt 101',
  })
  @IsNotEmpty()
  @IsString()
  address: string;
}
