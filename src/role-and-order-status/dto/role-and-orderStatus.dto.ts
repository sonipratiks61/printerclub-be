import { IsInt, IsNotEmpty, ArrayMinSize } from "class-validator";

export class RoleAndOrderStatusDto {
    @IsInt({ message: 'Role ID must be a number' })
    @IsNotEmpty({ message: 'Role ID cannot be empty' })
    roleId: number;
  
    @IsInt({ each: true, message: 'Each capability ID must be a number' })
    @ArrayMinSize(1, { message: 'Capability IDs array must not be empty' })
    orderStatusIds: number[];
  }
  export class UpdateRoleAndOrderStatusDto {
    @IsInt({ message: 'Role ID must be a number' })
    @IsNotEmpty({ message: 'Role ID cannot be empty' })
    roleId: number;

    @IsInt({ each: true, message: 'Each orderStatus ID must be a number' })
    orderStatusToAdd: number[];
  
    @IsInt({ each: true, message: 'Each orderStatus ID must be a number' })
    orderStatusToDelete: number[];
  }