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
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiResponse,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';

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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john.doe@example.com' },
        password: { type: 'string', example: 'strongPassword123!' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'user login successfully.',
    type: CreateUserDto,
  })
  async login(
    @Body() body: { email: string; password: string },
    @Res() response: Response,
  ) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );

      if (!user) {
        response.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'The email or password you entered is Wrong',
        });
        return;
      }
      if (user) {
        const {
          accessToken,
          refreshToken,
          user: userData,
        } = await this.authService.login(user);
        response.setHeader('X-Access-Token', accessToken);
        response.setHeader('X-Refresh-Token', refreshToken);
        response.status(HttpStatus.OK).json({
          success: true,
          message: 'Login Successfully',
          data: userData,
        });
      } else {
        response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: 'Authentication failed' });
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          { success: false, message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('refresh-token')
  @ApiResponse({
    status: 200,
    description: 'user refresh-token successfully.',
    type: CreateUserDto,
  })
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password link has been sent to the user email.',
    type: CreateUserDto,
  })
  @ApiBearerAuth()
  async forgotPassword(@Body('email') email: string): Promise<any> {
    try {
      await this.authService.forgotPassword(email);
      return {
        success: true,
        message: 'Reset password link has been sent to your email.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            success: false,
            message: error.message || 'There was a problem accessing data',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('reset-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'new_password' },
      },
      required: ['password'],
    },
  })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully.',
  })
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
