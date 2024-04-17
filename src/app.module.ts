import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtRefreshTokenStrategy } from './auth/jwt-refresh.strategy';
import { MailService } from './mail/mail.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AppController, AuthController, UserController],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    JwtRefreshTokenStrategy,
    MailService,
    JwtStrategy,
    UserService,
  ],
})
export class AppModule {}
