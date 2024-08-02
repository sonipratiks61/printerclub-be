// src/user/user.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpStatus,
  Patch,
  Param,
  Body,
  ForbiddenException,
  Res,
  Req,
  BadRequestException,
  NotFoundException,
  Put,
  Post,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { ResponseService } from 'utils/response/customResponse';
import { IdValidationPipe } from 'utils/validation/paramsValidation';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private responseService: ResponseService,
  ) { }

  @Get('user/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns the user profile',
    type: CreateUserDto,
  })
  getProfile(@Request() req, @Res() res) {
    try {
      const user = req.user;
      return this.responseService.sendSuccess(
        res,
        'User profile retrieved successfully',
        user,
      );
    } catch (error) {
      return this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
        error,
      );
    }
  }

  @Get('/admin/allUser')
  @UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access this route
  @ApiOkResponse({
    description: 'List of all users with addresses',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiBearerAuth()
  async findAllUsers(@Res() res) {
    try {
      const users = await this.userService.findAllUsersWithAddresses();
      return this.responseService.sendSuccess(
        res,
        'Users retrieved successfully',
        users,
      );
    } catch (error) {
      return this.responseService.sendInternalError(
        res,
        'Something went wrong',
        error,
      );
    }
  }

  @Patch('admin/user/active/:id')
  @UseGuards(AuthGuard('jwt')) // Assuming JWT is used for authentication
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Updated Successfully',
    type: CreateUserDto,
  })
  async setActiveStatus(
    @Param('id', IdValidationPipe) id: string,
    @Body('isActive') isActive: boolean,
    @Req() req,
    @Res() res,
  ) {
    try {
      if (req.user.id === Number(id)) {
        return this.responseService.sendBadRequest(
          res,
          'You cannot change your own active status.',
        );
      }

      const updatedUser = await this.userService.setActiveStatus(
        Number(id),
        isActive,
      );
      return this.responseService.sendSuccess(
        res,
        'User status updated successfully',
        updatedUser,
      );
    } catch (error) {
      console.log(error);
      if (error instanceof ForbiddenException) {
        return this.responseService.sendBadRequest(res, error.message);
      } else {
        return this.responseService.sendInternalError(
          res,
          error.message || 'Something went wrong',
          error,
        );
      }
    }
  }

  @Post('/admin/user')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Created Successfully',
    type: CreateUserDto,
  })
  async createUserByAdmin(
    @Body() createUserDto: CreateUserDto,
    @Res() res,
    @Req() req,
  ) {
    try {
      const data = await this.userService.userCreateByAdmin(
        createUserDto,
      );
      if (data) {
        this.responseService.sendSuccess(
          res,
          'User Created Successfully',
        );
      }
      else {
        this.responseService.sendBadRequest(res, 'Failed to Create User');
      }
    } catch (error) {
       if(error instanceof NotFoundException){
        return this.responseService.sendNotFound(res, error.message);
      }
      else if (error instanceof ConflictException) {
        this.responseService.sendConflict(res, error.message,error.getResponse());
      }
     else{
      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',

      );}

    }
  }

  @Patch('admin/user/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Updated Successfully',
    type: CreateUserDto,
  })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
    @Req() req,
    @Param('id', IdValidationPipe) id: string,
  ) {
    try {
      const user=this.userService.findOne(Number(id))
      if(!user)
      {
        this.responseService.sendNotFound(res,"User not found")
      }
      const userId= parseInt(id,10)
      
      const data = await this.userService.updateUserByAdmin(
        userId,
        updateUserDto,
      );
      if(data){
      this.responseService.sendSuccess(
        res,
        'User Updated Successfully',
        data,
      );
      }else{
        this.responseService.sendBadRequest(res, 'Failed to update Profile');
      }
    } catch (error) {
      if(error instanceof NotFoundException){
        return this.responseService.sendNotFound(res, error.message);
      }
      else if (error instanceof ConflictException) {
        this.responseService.sendConflict(res, error.message,error.getResponse());
      }else{
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
          error,
        );
      } 
    }
  }
  
}
