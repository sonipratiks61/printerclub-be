import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from 'src/user/dto/create-and-update-address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async create(
    createAddressDto: CreateAddressDto | CreateAddressDto[],
    userId: number,
  ) {
    // Ensure createAddressDto is an array
    const addresses = Array.isArray(createAddressDto)
      ? createAddressDto
      : [createAddressDto];

    // Validate each CreateAddressDto object
    for (const addressDto of addresses) {
      if (
        !addressDto.address ||
        !addressDto.city ||
        !addressDto.state ||
        !addressDto.country ||
        !addressDto.pinCode
      ) {
        throw new Error('All address fields are required.');
      }

      const pinCodeRegex = /^\d{6}$/;
      if (!pinCodeRegex.test(addressDto.pinCode)) {
        throw new Error('Invalid pinCode format.');
      }
    }

    const createOperations = addresses.map((addressDto) => ({
      address: addressDto.address,
      city: addressDto.city,
      state: addressDto.state,
      country: addressDto.country,
      pinCode: addressDto.pinCode,
      userId: userId,
    }));

    if (createOperations.length === 0) {
      throw new Error('At least one address must be provided.');
    }

    const createdAddresses = [];
    for (const operation of createOperations) {
      const createdAddress = await this.prisma.address.create({
        data: operation,
      });
      createdAddresses.push(createdAddress);
    }
    return createdAddresses;
  }

  async findOne(id: number) {
    return await this.prisma.address.findUnique({
      where: {
        id: id,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.address.delete({
      where: {
        id,
      },
    });
  }

  async findAllAddress() {
    return this.prisma.address.findMany({
      select: {
        id: true,
        userId: true,
        country: true,
        state: true,
        city: true,
        pinCode: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: number, createAddressDto: CreateAddressDto) {
    return this.prisma.address.update({
      where: {
        id,
      },
      data: createAddressDto,
    });
  }
}
