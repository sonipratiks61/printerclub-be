import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
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
}
