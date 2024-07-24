import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/role/role.service';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
    private roleService: RoleService) { }

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

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async userCreateByAdmin(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 8);
    const userEmail = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email

      }
    });
    const userMobileNumber = await this.prisma.user.findFirst({
      where: {
        mobileNumber: createUserDto.mobileNumber

      }
    })
    const role = await this.roleService.findOne(createUserDto.roleId)
    if (!role) {
      throw new NotFoundException('Role not found')
    }
    if (userEmail) {
      throw new ConflictException("Email is Already Exist ")
    }
    if (userMobileNumber) {
      throw new ConflictException("Mobile is Already Exist ")
    }

    const data = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        businessName: createUserDto.businessName,
        roleId: createUserDto.roleId,
        gstNumber: createUserDto.gstNumber,
        email: createUserDto.email,
        mobileNumber: createUserDto.mobileNumber,
        acceptTerms: createUserDto.acceptTerms,
        isActive: false,
        password: hashedPassword,
        addresses: {
          create: createUserDto.addresses
        }
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        email: true,
        mobileNumber: true,
        gstNumber: true,
        roleId: true,
        isActive: true,
        acceptTerms: true,
        addresses: {
          select: {
            address: true,
            city: true,
            state: true,
            country: true,
            pinCode: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
    return data;
  }

  async updateUserByAdmin(id: number, updateUserDto: UpdateUserDto) {
    const role = await this.roleService.findOne(updateUserDto.roleId);
    const userMobileNumber = await this.prisma.user.findFirst({
      where: {
        mobileNumber: updateUserDto.mobileNumber
      }
    })
    if (userMobileNumber) {
      throw new ConflictException("Mobile is Already Exist ")
    }
    if (!role) {
      throw new NotFoundException("Role not Found")
    }
    const address = await this.prisma.address.findFirst({
      where: {
        userId: id,
      },
      select: {
        id: true,

      }
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
        roleId: updateUserDto.roleId,
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
      select: {
        id: true, name: true, businessName: true,

        addresses: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            pinCode: true,
            country: true,
          }
        }, role: {
          select: {
            id: true,
            name: true,

          }
        }
      }
    })
    return data;

  }
}
