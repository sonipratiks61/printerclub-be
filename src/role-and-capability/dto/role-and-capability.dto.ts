import { IsNotEmpty } from 'class-validator';

export class RoleAndCapabilityDto {
  @IsNotEmpty()
  roleId: number;

  @IsNotEmpty()
  capabilityIds: number[];
}
