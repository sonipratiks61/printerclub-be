import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CapabilityDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateRoleDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CapabilityDto)
  @ArrayNotEmpty({ message: 'Capabilities array cannot be empty' })
  capabilities: CapabilityDto[];
}
