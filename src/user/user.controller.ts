// src/user/user.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    // The user object is attached to the request in the JWT strategy validate method
    return req.user;
  }
}
