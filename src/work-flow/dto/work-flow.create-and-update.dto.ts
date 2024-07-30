import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateWorkFlowDto {
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name: string;
  
    sequence: number[];
  }
  export class UpdateWorkFlowDto {
    @IsOptional()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    sequence: number[];
  }
  
