import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeoLocationService {
  constructor(private prisma: PrismaService) {}

  async findAllUsersWithAddresses(pincode?: string) {
    const query = {
      select: {
        id: true,
        city: true,
        state: true,
        pincode: true,
      },
    };
    if (pincode) {
      return this.prisma.geoLocation.findMany({
        where: {
          pincode: {
            contains: pincode,
          },
        },
        ...query,
      });
    } else {
      return this.prisma.geoLocation.findMany({
        ...query,
      });
    }
  }
}
