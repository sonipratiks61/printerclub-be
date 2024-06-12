import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAllUsersWithAddresses() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        mobileNumber: true,
        businessName: true,
        isActive: true,
        gstNumber: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          select: {
            country: true,
            state: true,
            city: true,
            pinCode: true,
            address: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  async create(user: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 8);

    const defaultRole = await this.prisma.role.findUnique({
      where: { name: 'User' },
    });
    if (!defaultRole) {
      throw new Error('Default role not found in database');
    }
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: user.email }, { mobileNumber: user.mobileNumber }],
      },
    });

    if (existingUser) {
      if (existingUser.email === user.email) {
        throw new Error('Email already in use');
      } else if (existingUser.mobileNumber === user.mobileNumber) {
        throw new Error('Mobile number already in use');
      }
    }
    const data = await this.prisma.user.create({
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
        isActive: false,
      },
    });
    return data;
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const {
      name,
      email,
      businessName,
      mobileNumber,
      password,
      gstNumber,
      acceptTerms,
      addresses,
    } = updateUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [{ email: email }, { mobileNumber: mobileNumber }],
          },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already in use');
      } else if (existingUser.mobileNumber === mobileNumber) {
        throw new Error('Mobile number already in use');
      }
    }

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 8);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        businessName,
        mobileNumber,
        password: hashedPassword,
        gstNumber,
        acceptTerms,
        addresses: {
          create: addresses.map((address) => ({
            country: address.country,
            state: address.state,
            city: address.city,
            pinCode: address.pinCode,
            address: address.address,
          })),
        },
      },
    });
  }

  async findOne(userId: number) {
    try {
      await this.prisma.user.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to delete user');
    }
  }
  async setActiveStatus(userId: number, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }
}
