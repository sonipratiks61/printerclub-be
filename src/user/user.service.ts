import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findAllUsersWithAddresses() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        mobileNumber: true,
        businessName: true,
        isActive: true,
        gstNumber: true,
        acceptTerms: true,
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
            id:true,
            name: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      businessName: user.businessName,
      mobileNumber: user.mobileNumber,
      email: user.email,
      isActive: user.isActive,
      acceptTerms: user.acceptTerms,
      gstNumber: user.gstNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleId:user.role.id,
      role: user.role.name,
      addresses: user.addresses,
    }));
  }

  async setActiveStatus(userId: number, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }
  async updateProfile(id: number, updateUserDto: UpdateUserDto) {

    // Fetch current address associated with the user
    const address = await this.prisma.address.findFirst({
      where: {
        userId: id,
      },
    });
    const data = await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        name: updateUserDto.name,
        businessName: updateUserDto.businessName,
        mobileNumber: updateUserDto.mobileNumber,
        gstNumber: updateUserDto.gstNumber,
        addresses: {
          update: {
            where: {
              id: address.id
            },
            data: {
              address: updateUserDto.addresses.address,
              city: updateUserDto.addresses.city,
              state: updateUserDto.addresses.state,
              pinCode: updateUserDto.addresses.pinCode,
              country: updateUserDto.addresses.country,
            }
          }
        },

      },
      include: { addresses: true }
    })

    const formattedResponse = {
      id: data.id,
      mobileNumber: data.mobileNumber,
      businessName: data.businessName,
      name: data.name,
      gstNumber: data.gstNumber,
      roleId: data.roleId,
      acceptTerms: data.acceptTerms,
      addresses: {
        id: address.id,
        country: address.country,
        state: address.state,
        city: address.city,
        pinCode: address.pinCode,
        address: address.address,
      },

    };
    return formattedResponse;
  }
}
