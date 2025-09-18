import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/role/role.service';
import { AttachmentService } from 'src/attachment/attachment.service';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private roleService: RoleService,
    private attachmentService: AttachmentService,
  ) {}

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
        password: true,
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
            id: true,
            name: true,
          },
        },
      },
    });
    const attachments = await this.prisma.attachmentAssociation.findMany({
      where: {
        relationType: 'user',
      },
      select: {
        relationId: true,
        attachments: {
          select: {
            attachment: {
              select: {
                id: true,
                fileName: true,
                filePath: true,
              },
            },
          },
        },
      },
    });

    const attachmentMap = attachments.reduce(
      (acc, item) => {
        if (item.attachments.length > 0) {
          acc[item.relationId] = item.attachments[0].attachment; // Take only the first attachment
        }
        return acc;
      },
      {} as Record<
        number,
        { id: number; fileName: string; filePath: string } | null
      >,
    );

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      businessName: user.businessName,
      mobileNumber: user.mobileNumber,
      password: user.password,
      email: user.email,
      isActive: user.isActive,
      acceptTerms: user.acceptTerms,
      gstNumber: user.gstNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleId: user.role.id,
      role: user.role.name,
      addresses: user.addresses,
      attachment: attachmentMap[user.id] || null,
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
        email: createUserDto.email,
      },
    });
    const userMobileNumber = await this.prisma.user.findFirst({
      where: {
        mobileNumber: createUserDto.mobileNumber,
      },
    });
    const role = await this.roleService.findOne(createUserDto.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const errors: { email?: string; mobileNumber?: string } = {};

    if (userEmail) {
      errors.email = 'Email is Already Exist';
    }
    if (userMobileNumber) {
      errors.mobileNumber = 'MobileNumber is Already Exist';
    }
    if (Object.keys(errors).length > 0) {
      throw new ConflictException(errors);
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
          create: createUserDto.addresses,
        },
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
            pinCode: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    let file = null;

    if (createUserDto.attachmentId) {
      const isUploadFile = await this.prisma.attachmentAssociation.create({
        data: {
          relationId: data.id,
          relationType: 'user',
        },
      });

      const isCheckAttachment = await this.attachmentService.findOne(
        createUserDto.attachmentId,
      );

      if (!isCheckAttachment) {
        throw new NotFoundException('Attachment not found');
      }

      await this.prisma.attachmentToAssociation.create({
        data: {
          attachmentId: createUserDto.attachmentId,
          attachmentAssociationId: isUploadFile.id,
        },
      });

      file = isCheckAttachment.filePath;
    }

    return data;
  }

  async updateUserByAdmin(id: number, updateUserDto: UpdateUserDto) {
    const userData = await this.findOne(id);
    if (!userData) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword =
      updateUserDto.password === userData.password
        ? userData.password
        : await bcrypt.hash(updateUserDto.password, 8);

    const role = await this.roleService.findOne(updateUserDto.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const errors: { mobileNumber?: string } = {};

    const userMobileNumber = await this.prisma.user.findFirst({
      where: {
        mobileNumber: updateUserDto.mobileNumber,
        id: { not: id },
      },
    });
    if (userMobileNumber) {
      errors.mobileNumber = 'Mobile number already exists';
    }
    if (Object.keys(errors).length > 0) {
      throw new ConflictException(errors);
    }

    const address = await this.prisma.address.findFirst({
      where: {
        userId: id,
      },
      select: {
        id: true,
      },
    });
    const data = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: updateUserDto.name,
        businessName: updateUserDto.businessName,
        mobileNumber: updateUserDto.mobileNumber,
        gstNumber: updateUserDto.gstNumber,
        password: hashedPassword,
        roleId: updateUserDto.roleId,
        addresses: {
          update: {
            where: {
              id: address.id,
            },
            data: {
              address: updateUserDto.addresses[0].address,
              city: updateUserDto.addresses[0].city,
              state: updateUserDto.addresses[0].state,
              pinCode: updateUserDto.addresses[0].pinCode,
              country: updateUserDto.addresses[0].country,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        addresses: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            pinCode: true,
            country: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (updateUserDto.attachmentId) {
      const isCheckAttachment = await this.attachmentService.findOne(
        updateUserDto.attachmentId,
      );
      if (!isCheckAttachment) {
        throw new NotFoundException('Attachment not found');
      }

      const existingAttachmentAssociation =
        await this.prisma.attachmentAssociation.findFirst({
          where: {
            relationId: id,
            relationType: 'user',
          },
        });

      if (existingAttachmentAssociation) {
        await this.prisma.attachmentToAssociation.updateMany({
          where: {
            attachmentAssociationId: existingAttachmentAssociation.id,
          },
          data: {
            attachmentId: updateUserDto.attachmentId,
          },
        });
      } else {
        const newAttachmentAssociation =
          await this.prisma.attachmentAssociation.create({
            data: {
              relationId: id,
              relationType: 'user',
            },
          });

        await this.prisma.attachmentToAssociation.create({
          data: {
            attachmentId: updateUserDto.attachmentId,
            attachmentAssociationId: newAttachmentAssociation.id,
          },
        });
      }
    }
    return data;
  }

  async editUser(id: number, updateUserDto: UpdateUserDto) {
    const errors: { mobileNumber?: string } = {};

    const userMobileNumber = await this.prisma.user.findFirst({
      where: {
        mobileNumber: updateUserDto.mobileNumber,
        id: { not: id },
      },
    });

    if (userMobileNumber) {
      errors.mobileNumber = 'Mobile number already exists';
      throw new ConflictException(errors);
    }

    const address = await this.prisma.address.findFirst({
      where: { userId: id },
      select: { id: true },
    });

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        businessName: updateUserDto.businessName,
        mobileNumber: updateUserDto.mobileNumber,
        gstNumber: updateUserDto.gstNumber,
        addresses: {
          update: {
            where: { id: address?.id },
            data: {
              address: updateUserDto.addresses.address,
              city: updateUserDto.addresses.city,
              state: updateUserDto.addresses.state,
              pinCode: updateUserDto.addresses.pinCode,
              country: updateUserDto.addresses.country,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        email: true,
        mobileNumber: true,
        gstNumber: true,
        isActive: true,
        acceptTerms: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            pinCode: true,
            country: true,
          },
        },
        role: true,
        attachments: {
          select: {
            id: true,
            fileName: true,
            filePath: true,
          },
        },
      },
    });

    const existingAttachmentAssociation =
      await this.prisma.attachmentAssociation.findFirst({
        where: { relationId: id, relationType: 'user' },
      });

    const { attachments, ...rest } = updatedUser;

    if (updateUserDto.attachmentId) {
      if (existingAttachmentAssociation) {
        await this.prisma.attachmentToAssociation.updateMany({
          where: { attachmentAssociationId: existingAttachmentAssociation.id },
          data: { attachmentId: updateUserDto.attachmentId },
        });
      } else {
        const newAttachmentAssociation =
          await this.prisma.attachmentAssociation.create({
            data: { relationId: id, relationType: 'user' },
          });

        await this.prisma.attachmentToAssociation.create({
          data: {
            attachmentId: updateUserDto.attachmentId,
            attachmentAssociationId: newAttachmentAssociation.id,
          },
        });
      }

      return {
        ...rest,
        attachment:
          attachments.find((a) => a.id === updateUserDto.attachmentId) || null,
      };
    } else if (existingAttachmentAssociation) {
      await this.prisma.attachmentToAssociation.deleteMany({
        where: { attachmentAssociationId: existingAttachmentAssociation.id },
      });

      await this.prisma.attachmentAssociation.delete({
        where: { id: existingAttachmentAssociation.id },
      });

      return {
        ...rest,
        attachment: null,
      };
    }

    return {
      ...rest,
      attachment: attachments.find(
        (attachment) => existingAttachmentAssociation?.id === attachment.id,
      ),
    };
  }
}
