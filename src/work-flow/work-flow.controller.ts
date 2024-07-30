import {
    Controller,
    Post,
    UseGuards,
    Get,
    Body,
    Res,
    Param,
    NotFoundException,
    Delete,
    Patch,
    ConflictException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { ApiResponse } from '@nestjs/swagger';
  // import { RoleService } from './role.service';
  import { ResponseService } from 'utils/response/customResponse';
  import { IdValidationPipe } from 'utils/validation/paramsValidation';
  import { WorkFlowService } from './work-flow.service';
import { CreateWorkFlowDto, UpdateWorkFlowDto } from './dto/work-flow.create-and-update.dto';
import { Req } from '@nestjs/common';
  
  @Controller('workFlow')
  export class WorkFlowController {
    constructor(
      private readonly workFlowService: WorkFlowService,
      private readonly responseService: ResponseService,
    ) {}
  
    // @Get()
    // async fetchAll(@Res() res) {
    //   try {
    //     const data = await this.workFlowService.findAll();
    //     this.responseService.sendSuccess(res, 'Fetch Successfully!', data);
    //   } catch (error) {
    //     this.responseService.sendInternalError(
    //       res,
    //       'Something Went Wrong',
    //       error,
    //     );
    //   }
    // }
  
    @Post()
    @ApiResponse({
      status: 200,
      description: 'The user has been successfully created.',
      type: CreateWorkFlowDto,
    })
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() createWorkFlowDto: CreateWorkFlowDto, @Res() res, @Req() req) {
      try {
     
          const data = await this.workFlowService.create(createWorkFlowDto);
          if (data) {
            this.responseService.sendSuccess(res, 'WorkFlow Create Successfully');
          } else {
            this.responseService.sendBadRequest(res, 'Failed to RolWorkFlow');
          }
        
      } catch (error) {
        if (error instanceof ConflictException) {
          this.responseService.sendConflict(res, error.message);
        } else {
          this.responseService.sendInternalError(
            res,
            'Something Went Wrong',
            error,
          );
        }
      }
    }
  
    // @Get(':id')
    // @UseGuards(AuthGuard('jwt'))
    // async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    //   try {
    //     const roleId = parseInt(id, 10);
    //     const role = await this.workFlowService.findOne(roleId);
    //     if (!role) {
    //       this.responseService.sendNotFound(res, 'Invalid Role Id ');
    //     }
    //     if (role) {
    //       this.responseService.sendSuccess(res, 'Role Fetch Successfully', role);
    //     } else {
    //       this.responseService.sendBadRequest(res, 'Failed to  Role Fetch');
    //     }
    //   } catch (error) {
    //     this.responseService.sendInternalError(res, 'Something Went Wrong');
    //   }
    // }
  
    // @Delete(':id')
    // @UseGuards(AuthGuard('jwt'))
    // async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
    //   const roleId = parseInt(id, 10);
    //   try {
    //     const role = await this.workFlowService.findOne(roleId);
    //     if (!role) {
    //       this.responseService.sendNotFound(res, 'Invalid Role Id');
    //     }
    //     const data = await this.workFlowService.delete(roleId);
    //     if (data) {
    //       this.responseService.sendSuccess(res, 'Role Deleted Successfully');
    //     } else {
    //       this.responseService.sendBadRequest(res, 'Failed to Role Delete');
    //     }
    //   } catch (error) {
    //     this.responseService.sendInternalError(res, 'Something Went Wrong');
    //   }
    // }
  
    @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateRole(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateRoleDto: UpdateWorkFlowDto,
    @Res() res,
  ) {
    try {
      const roleId = parseInt(id, 10);
     const data= await this.workFlowService.update(roleId,updateRoleDto)
     console.log(data);
     this.responseService.sendSuccess(res,'Updated WorkFlow Successfully',data)
    } catch (error) {
      console.log(error);
      if (error instanceof ConflictException) {
        this.responseService.sendConflict(res, error.message);
      }
      else{
      this.responseService.sendInternalError(res, 'Something Went Wrong');
    }
  }
  }
  }
