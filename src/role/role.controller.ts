// attachments.controller.ts
import { Controller, Post, UseGuards, Get, Body, Res, Param, NotFoundException, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
// import { RoleService } from './role.service';
import { ResponseService } from 'utils/response/customResponse';
import { RoleService } from './role.service';
import { IdValidationPipe } from 'utils/validation/paramsValidation';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly responseService: ResponseService, // Inject the ResponseService
  ) { }

  @Get()
  async fetchAll(@Res() res) {
    try {
      const data = await this.roleService.findAll();
      this.responseService.sendSuccess(res, 'Fetch Successfully!', data);
    } catch (error) {
      console.log(error);
      this.responseService.sendInternalError(
        res,
        error.message || 'Something Went Wrong',
        error,
      );
    }
  }


  @Post()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully created.',
    type: CreateRoleDto,
  })
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res) {
    try {
      const data = await this.roleService.findByName(createRoleDto.name);
      if (data) {
         this.responseService.sendBadRequest(res, "This Role Name is already exist")
      }
      else {
        await this.roleService.create(createRoleDto);
        this.responseService.sendSuccess(res, 'Create Successfully');
      }
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      }
      else {
        this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong',
          error,
        );
      }
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const roleId = parseInt(id, 10);
      const role = await this.roleService.findOne(roleId);
      if (!role) {
        this.responseService.sendNotFound(
          res,
          "Invalid Role Id ",
        );
      }
      this.responseService.sendSuccess(res, 'Fetch Successfully', role);
    } catch (error) {
      console.log(error);
      this.responseService.sendInternalError(
        res,
        error.message || 'Something Went Wrong',
      );
      return;
    }
  }


  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
    const roleId = parseInt(id, 10);
    try {
      const role = await this.roleService.findOne(roleId);
      if (!role) {
        this.responseService.sendNotFound(
          res,
          'Invalid Role Id',
        );
      }
      await this.roleService.delete(roleId);
      this.responseService.sendSuccess(res, 'Role Deleted Successfully');
    } catch (error) {
      console.error(error);

      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
      );
    }
  }



}
