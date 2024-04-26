import {
  Body,
  Controller,
  Post,
  Res,
  Headers,
  HttpStatus,
  UseGuards,
  Get,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto,
  })
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() response: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (user) {
      const {
        accessToken,
        refreshToken,
        user: userData,
      } = await this.authService.login(user);
      response.setHeader('X-Access-Token', accessToken);
      response.setHeader('X-Refresh-Token', refreshToken);
      response.status(HttpStatus.OK).json(userData);
    } else {
      // To maintain consistency in the response, even when authentication fails
      response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Authentication failed' });
    }
  }

  @Get('refresh-token')
  @UseGuards(AuthGuard('jwt-refresh')) // Use the custom refresh guard
  async refreshToken(
    @Headers('authorization') refreshToken: string,
    @Res() response: Response,
  ) {
    try {
      const user = await this.authService.validateRefreshToken(refreshToken);
      if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      const accessToken = await this.authService.createAccessToken(user);
      response.setHeader('X-Access-Token', accessToken);
      response.status(HttpStatus.OK).json();
    } catch (error) {
      throw new HttpException(
        'Token refresh failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<any> {
    try {
      await this.authService.forgotPassword(email);
      return { message: 'Reset password link has been sent to your email.' };
    } catch (error) {
      console.error(error);
      return { message: 'Reset password link has been sent to your email.' };
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { password: string },
    @Headers('authorization') token: string,
  ): Promise<any> {
    try {
      await this.authService.resetPassword(token, body.password);
      return { message: 'Password has been successfully reset.' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to reset password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
