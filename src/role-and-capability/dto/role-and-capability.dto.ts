import { ArrayMinSize, IsInt, IsNotEmpty } from 'class-validator';

export class RoleAndCapabilityDto {
  @IsInt({ message: 'Role ID must be a number' })
  @IsNotEmpty({ message: 'Role ID cannot be empty' })
  roleId: number;

  @IsInt({ each: true, message: 'Each capability ID must be a number' })
  @ArrayMinSize(1, { message: 'Capability IDs array must not be empty' })
  capabilityIds: number[];
}
