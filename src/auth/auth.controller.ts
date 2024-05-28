import {
  Body,
  Controller,
  Post,
  Res,
  Headers,
  UseGuards,
  Get,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiResponse,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResponseService } from 'utils/response/customResponse';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private responseService: ResponseService,
  ) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto,
  })
  signUp(@Body() createUserDto: CreateUserDto, @Res() res) {
    return this.authService.signUp(createUserDto, res);
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
  async login(@Body() body: { email: string; password: string }, @Res() res) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );

      if (!user) {
        this.responseService.sendAuthenticationFailed(
          res,
          'The email or password you entered is wrong',
        );
        return;
      }
      if (user) {
        const {
          accessToken,
          refreshToken,
          user: userData,
        } = await this.authService.login(user);
        res.setHeader('X-Access-Token', accessToken);
        res.setHeader('X-Refresh-Token', refreshToken);
        return this.responseService.sendSuccess(
          res,
          'Login Successfully',
          userData,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        return this.responseService.sendInternalError(
          res,
          'Internal server error',
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
    @Res() res,
  ) {
    try {
      const user = await this.authService.validateRefreshToken(
        refreshToken,
        res,
      );

      if (!user) {
        this.responseService.sendAuthenticationFailed(res, 'Invalid token');
        return;
      }
      const accessToken = await this.authService.createAccessToken(user);
      res.setHeader('X-Access-Token', accessToken);
      return this.responseService.sendSuccess(
        res,
        'Token refreshed successfully',
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        return this.responseService.sendInternalError(
          res,
          'Token refresh failed',
        );
      }
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
  async forgotPassword(@Body('email') email: string, @Res() res): Promise<any> {
    try {
      await this.authService.forgotPassword(email);
      return this.responseService.sendSuccess(
        res,
        'Reset password link has been sent to your email.',
      );
    } catch (error) {
      console.error(error);
      return this.responseService.sendInternalError(
        res,
        'An error occurred while attempting to send the reset password link.',
      );
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
    @Res() res,
  ): Promise<any> {
    try {
      await this.authService.resetPassword(token, body.password);
      this.responseService.sendSuccess(
        res,
        'Password has been successfully reset.',
      );
    } catch (error) {
      return this.responseService.sendInternalError(
        res,
        error.message || 'Failed to reset password',
      );
    }
  }
}
