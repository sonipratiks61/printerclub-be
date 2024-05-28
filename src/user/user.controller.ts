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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseService } from 'utils/response/customResponse';

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
  }) // Specify the response type
  getProfile(@Request() req, @Res() res) {
    // The user object is attached to the request in the JWT strategy validate method
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
        'something went wrong',
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
    description: 'Internal server error',
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
        'something went wrong',
        error,
      );
    }
  }

  @Patch(':id/active')
  @UseGuards(AuthGuard('jwt')) // Assuming JWT is used for authentication
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Updated successfully',
    type: CreateUserDto,
  })
  async setActiveStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
    @Req() req,
    @Res() res,
  ) {
    // Prevent users from changing their own active status
    try {
      // Prevent users from changing their own active status
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
          error.message || 'something went wrong',
          error,
        );
      }
    }
  }
}
