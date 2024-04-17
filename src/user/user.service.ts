import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
      },
    });
  }
}
