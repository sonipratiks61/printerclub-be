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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { ResponseService } from 'utils/response/customResponse';
import { IdValidationPipe } from 'utils/validation/paramsValidation';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private responseService: ResponseService,
  ) {}

  @Get('me')
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

  @Get()
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

  @Patch('active/:id')
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


  @Put()
  @UseGuards(AuthGuard('jwt')) // Assuming JWT is used for authentication
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Updated Successfully',
    type: CreateUserDto,
  })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
    @Req() req
  ) {
    try {
      const userId = req.user.id
      const updatedMyProfile = await this.userService.updateProfile(
        userId,
        updateUserDto,
      );
      this.responseService.sendSuccess(
        res,
        'Profile Edit Successfully',
        updatedMyProfile,
      );
    } catch (error) {
     
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
          error,
        );
      
    }
  }
  
}
