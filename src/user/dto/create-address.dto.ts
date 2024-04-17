import { IsNotEmpty, IsString, IsPostalCode } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsPostalCode()
  @IsNotEmpty()
  pinCode: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
