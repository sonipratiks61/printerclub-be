import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from 'src/user/dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto[], userId: number) {
    try {
      const createOperations = createAddressDto.map((addressDto) => ({
        address: addressDto.address,
        city: addressDto.city,
        state: addressDto.state,
        country: addressDto.country,
        pinCode: addressDto.pinCode,
        userId: userId,
      }));
      if (createOperations.length === 0) {
        throw new Error('At least Enter the One Address');
      }
      const createdAddresses = [];
      for (const operation of createOperations) {
        const createdAddress = await this.prisma.address.create({
          data: operation,
        });
        createdAddresses.push(createdAddress);
      }
      return createdAddresses;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
