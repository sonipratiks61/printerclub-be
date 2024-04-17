// src/user/user.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    // The user object is attached to the request in the JWT strategy validate method
    return req.user;
  }

  @Get()
  @UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access this route
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
}
