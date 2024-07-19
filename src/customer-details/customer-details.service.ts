import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDetailsDto,UpdateCustomerDetailsDto } from './dto/customer-details.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressService } from 'src/address/address.service';
import { PaginationDto } from 'utils/pagination/pagination';

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

    async findAll(paginationDto:PaginationDto) {
        const { page = 1, pageSize = 10} = paginationDto;
        const skip = (page - 1) * pageSize;
  
    const [orderCustomers, totalOrderCustomers]= await Promise.all([
        this.prisma.orderCustomer.findMany({
          skip,
          take: pageSize,
        }),
        this.prisma.orderCustomer.count(),
      ]);
      const formattedOutput = orderCustomers.map(customer => ({
        name: customer.name,
        email: customer.email,
        mobileNumber: customer.mobileNumber,
    }));
      return{
        row:formattedOutput,
        count: totalOrderCustomers,
        page:page,
        pageSize:pageSize
      }

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
