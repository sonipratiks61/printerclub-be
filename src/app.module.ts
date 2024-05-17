import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { AttachmentService } from './attachment/attachment.service';
import { AttachmentController } from './attachment/attachment.controller';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadMiddleware } from 'utils/ImageUploadFunction/ImageUploadFunction';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/address.service';
import { GeoLocationController } from './geolocation/geolocation.controller';
import { GeoLocationService } from './geolocation/geolocation.service';

@Module({
  imports: [
    JwtModule.register({}),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    AttachmentController,
    AddressController,
    GeoLocationController,
  ],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    JwtRefreshTokenStrategy,
    MailService,
    JwtStrategy,
    UserService,
    AttachmentService,
    AddressService,
    GeoLocationService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FileUploadMiddleware).forRoutes('attachments');
  }
}
