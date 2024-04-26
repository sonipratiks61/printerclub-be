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
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested({ each: true })
  @Type(() => CapabilityDto)
  @ArrayNotEmpty()
  capabilities: CapabilityDto[];
}
