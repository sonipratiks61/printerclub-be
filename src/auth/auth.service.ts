import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';
// import { ResponseInterface } from 'utils/response/interface';
import { ResponseService } from 'utils/response/customResponse';
import { Response } from 'express'; // Import Response from express

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private readonly responseService: ResponseService,
  ) {}

  async signUp(user: CreateUserDto, res: Response): Promise<void> {
    const hashedPassword = await bcrypt.hash(user.password, 8);
    try {
      const defaultRole = await this.prisma.role.findUnique({
        where: { name: 'user' },
      });
      if (!defaultRole) {
        this.responseService.sendBadRequest(
          res,
          'Default role not found in database',
        );
      }
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
            create: user.addresses,
          },
          roleId: defaultRole.id,
          isActive: false, // User needs admin approval to activate
        },
      });
      this.responseService.sendCreateObject(
        res,
        'User signed up successfully.',
      );
      return;
    } catch (error) {
      console.log(error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // Check if meta and target exist and handle string or array type
        if (error.meta && error.meta.target) {
          let targetDescription = '';
          if (Array.isArray(error.meta.target)) {
            targetDescription = error.meta.target.join(', ');
          } else if (typeof error.meta.target === 'string') {
            targetDescription =
              error.meta.target === 'User_email_key'
                ? 'Email'
                : 'Mobile Number';
          }
          this.responseService.sendBadRequest(
            res,
            `A user with this ${targetDescription} already exists.`,
          );
          return;
        }
      }
      this.responseService.sendInternalError(res, 'Failed to register user.');
    }
  }

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        businessName: true,
        mobileNumber: true,
        email: true,
        password: true,
        isActive: true,
        acceptTerms: true,
        gstNumber: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        addresses:{
          select:{
            address:true,
            city:true,
            state:true,
            pinCode:true,
            country:true,
            
          }
        }
      },
    });
    if (!user) {
      throw new Error('User does not exist');
    }
    if (!user.isActive) {
      throw new Error('User not Activated yet, Please contact admin');
    }

    if (user.isActive && (await bcrypt.compare(pass, user.password))) {
      const { password: _password, role, ...result } = user;
      return {
        ...result,
        role: role.name,
      };
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
    };
  }

  async validateRefreshToken(token: string): Promise<any> {
    try {
      token = token.startsWith('Bearer ') ? token.slice(7) : token;

      const payload = this.jwtService.verify(token, {
        secret:
          process.env.JWT_REFRESH_TOKEN_SECRET || 'JWT_REFRESH_TOKEN_SECRET',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new Error('User not found or not active');
      }

      return { userId: payload.sub, username: payload.username };
    } catch (error) {
      if (error instanceof JwtService || error.status === 401) {
        throw new Error('Refresh token validation failed.');
      } else {
        throw error;
      }
    }
  }

  async createAccessToken(user: any): Promise<string> {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'JWT_ACCESS_TOKEN_SECRET',
      expiresIn: '24h',
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Please enter the valid email address');
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
        secret:
          process.env.JWT_REFRESH_TOKEN_SECRET || 'JWT_REFRESH_TOKEN_SECRET',
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
