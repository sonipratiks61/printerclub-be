import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey', // Use an environment variable for the secret in production
      signOptions: { expiresIn: '24h' }, // Adjust the expiration as needed
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService],
})
export class AppModule {}
