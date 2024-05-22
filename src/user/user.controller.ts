// src/user/user.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Patch,
  Param,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns the user profile',
    type: CreateUserDto,
  }) // Specify the response type
  getProfile(@Request() req) {
    // The user object is attached to the request in the JWT strategy validate method
    return req.user;
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
  async findAllUsers() {
    try {
      return await this.userService.findAllUsersWithAddresses();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem accessing user data',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
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
    @Request() req: any,
  ) {
    // Prevent users from changing their own active status
    if (req.user.id === Number(id)) {
      throw new ForbiddenException('You cannot change your own active status.');
    }

    return this.userService.setActiveStatus(Number(id), isActive);
  }
}
