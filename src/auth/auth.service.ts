import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
}
