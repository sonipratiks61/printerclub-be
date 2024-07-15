import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDetailsDto,UpdateCustomerDetailsDto } from './dto/customer-details.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class CustomerDetailsService {
    constructor(private prisma: PrismaService,
        private addressService:AddressService,  ) { }
   
        
    async findOne(id: number) {
        const customer = await this.prisma.orderCustomer.findFirst({
            where: {
                id: id
            }
        })
        return customer
    }

    async findAll() {
        const customers = await this.prisma.orderCustomer.findMany(
          
        )
        const formattedOutput = customers.map(customer => ({
            name: customer.name,
            email: customer.email,
            mobileNumber: customer.mobileNumber,
            
        }));
    
        return formattedOutput;
    }

    async update(id: number, updateCustomerDetailsDto: UpdateCustomerDetailsDto) {
        
        const customer = await this.prisma.orderCustomer.update({
            where: {
                id: id
            },
            data: {
                name: updateCustomerDetailsDto.name,
                email: updateCustomerDetailsDto.email,
                mobileNumber: updateCustomerDetailsDto.mobileNumber,
                additionalDetails:updateCustomerDetailsDto.additionalDetails,
                    }
        })
        return customer
    }

    async remove(id: number) {
        const data = await this.prisma.orderCustomer.delete({
            where: {
                id: id
            }
        })
        return data;
    }
}
