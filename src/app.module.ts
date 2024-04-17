import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtRefreshTokenStrategy } from './auth/jwt-refresh.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService, JwtRefreshTokenStrategy],
})
export class AppModule {}
