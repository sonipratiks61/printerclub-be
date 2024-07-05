import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDetailsDto,UpdateCustomerDetailsDto } from './dto/customer-details.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class CustomerDetailsService {
    constructor(private prisma: PrismaService,
        private addressService:AddressService,  ) { }
    async create(createCustomerDetailsDto: CreateCustomerDetailsDto) {

        const addressId = await this.addressService.findOne(createCustomerDetailsDto.addressId)
        if(!addressId)
        {
            throw new NotFoundException("Invalid Address Id")
        }
        const customer = await this.prisma.orderCustomer.create({
            data: {
                name: createCustomerDetailsDto.name,
                email: createCustomerDetailsDto.email,
                mobileNumber: createCustomerDetailsDto.mobileNumber,
                addressId: createCustomerDetailsDto.addressId,
                additionalDetails:createCustomerDetailsDto. additionalDetails,
         
            },
            include: {
                address: true
            }
        });

        const formattedOutput = {
            name: customer.name,
            email: customer.email,
            mobileNumber: customer.mobileNumber,
            address: customer.address.address,
            city: customer.address.city,
            state: customer.address.state
        };
        return formattedOutput;
    }

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
            {
                include:{
                    address:true
                }
            }
        )
        const formattedOutput = customers.map(customer => ({
            name: customer.name,
            email: customer.email,
            mobileNumber: customer.mobileNumber,
            address: customer.address.address,
            city: customer.address.city,
            state: customer.address.state
        }));
    
        return formattedOutput;
    }

    async update(id: number, updateCustomerDetailsDto: UpdateCustomerDetailsDto) {
        const addressId = await this.addressService.findOne(updateCustomerDetailsDto.addressId)
        if(!addressId)
        {
            throw new NotFoundException("Invalid Address Id")
        }
        const customer = await this.prisma.orderCustomer.update({
            where: {
                id: id
            },
            data: {
                name: updateCustomerDetailsDto.name,
                email: updateCustomerDetailsDto.email,
                mobileNumber: updateCustomerDetailsDto.mobileNumber,
                additionalDetails:updateCustomerDetailsDto.additionalDetails,
                addressId:updateCustomerDetailsDto.addressId
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
