import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(user: CreateUserDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(user.password, 8);
    try {
      await this.prisma.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
          mobileNumber: user.mobileNumber,
          businessName: user.businessName,
          name: user.name,
          gstNumber: user.gstNumber,
          acceptTerms: user.acceptTerms,
          addresses: {
            create: user.addresses, // Assuming addresses is an array of address data
          },
          isActive: false, // User needs admin approval to activate
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // Check if meta and target exist and handle string or array type
        if (error.meta && error.meta.target) {
          let targetDescription = '';
          if (Array.isArray(error.meta.target)) {
            // Handle array of targets
            targetDescription = error.meta.target.join(', ');
          } else if (typeof error.meta.target === 'string') {
            // Handle single string target
            targetDescription = error.meta.target;
          }
          throw new ConflictException(
            `A user with this ${targetDescription} already exists.`,
          );
        } else {
          throw new ConflictException(
            'Unique constraint failed on unspecified fields.',
          );
        }
      }
      throw new InternalServerErrorException('Failed to register user.');
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email, isActive: true },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const accessToken = this.jwtService.sign(
      { username: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_TOKEN_SECRET, expiresIn: '24h' },
    );

    const refreshToken = this.jwtService.sign(
      { username: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_TOKEN_SECRET, expiresIn: '30d' },
    );
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async validateRefreshToken(token: string): Promise<any> {
    try {
      // Remove 'Bearer ' prefix if present
      token = token.startsWith('Bearer ') ? token.slice(7) : token;

      // Verify the token and extract the payload
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      // Check in the database if the token is still valid (not revoked, still active)
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException(
          'Refresh token is invalid or has been revoked.',
        );
      }

      return { userId: payload.sub, username: payload.username };
    } catch (error) {
      if (error instanceof JwtService || error.status === 401) {
        throw new UnauthorizedException('Refresh token validation failed.');
      }
      throw error;
    }
  }

  async createAccessToken(user: any): Promise<string> {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '24h',
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User with this email does not exist.');
    }

    const resetToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_TOKEN_SECRET, expiresIn: '1h' },
    );

    const resetPasswordUrl = `${process.env.RESET_PASSWORD_LINK}?token=${resetToken}`;

    await this.mailService.sendMail(
      email,
      'Reset Password',
      `Please use the following link to reset your password: ${resetPasswordUrl}`,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      throw new Error('Invalid or expired reset token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  }
}
