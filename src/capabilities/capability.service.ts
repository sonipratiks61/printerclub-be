import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCapabilityDto } from './dto/capabilities.dto';

@Injectable()
export class CapabilityService {
    constructor(
        private prisma: PrismaService
    ) { }
    async create(createCapabilityDto: CreateCapabilityDto) {
        return await this.prisma.capability.create({
            data: {
                name: createCapabilityDto.name
            }
        })

    }
    async findAll() {
        return await this.prisma.capability.findMany();
    }

    async findOne(id: number) {
        return await this.prisma.capability.findUnique({
            where: {
                id: id
            }
        });
    }

    async delete(id: number) {
        return await this.prisma.capability.delete({
            where: {
                id: id
            }
        })
    }
    
    async update(id: number, createCapabilityDto: CreateCapabilityDto) {
        return await this.prisma.capability.update({
            where: { id: id },
            data: {
                name: createCapabilityDto.name
            }
        })
    }
}
