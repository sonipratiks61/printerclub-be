import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDetailsDto } from 'src/customer-details/dto/customer-details.dto';
import { ProductService } from 'src/product/product.service';
import { FinancialYear, generateInvoiceNumber } from 'utils/invoiceFunction/invoiceFunction';
import { calculatePrice } from 'utils/calculatePriceFunction/calculatePriceFunction';
import { addDays } from 'utils/dueDateFunction/dueDateFunction';

@Injectable()

export class CustomerOrderInvoiceService {
    constructor(private prisma: PrismaService) { }

    async customerOrderInvoice(id: number) {

        const order = await this.prisma.order.findUnique({
            where: {
                id: id
            },
            include: {
                customerDetails: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        mobileNumber: true,
                        address: {
                            select: {
                                id: true,
                                country: true,
                                state: true,
                                city: true,
                                pinCode: true,
                                address: true,
                                createdAt: true,
                                updatedAt: true,
                            }
                        }
                    }
                },
                orderItems: {
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        price: true,
                        description: true,
                        gst: true,
                        discount: true,
                        isMeasurementAddress:true,
                        createdAt:true

                    }
                }
            }
        });

        if (!order) {
            throw new NotFoundException("Order not found.");
        }
        const financialYear = await FinancialYear()

        const formattedInvoiceNumber = `${process.env.INVOICE_NUMBER_PREFIX}${financialYear}-${order.invoiceNumber}`;

        const formattedOrder = {
            id: order.id,
            invoiceNumber: formattedInvoiceNumber,
            advancePayment: Number(order.advancePayment)?.toFixed(2),
            remainingPayment: Number(order.remainingPayment).toFixed(2),
            totalPayment:Number(order.totalPayment).toFixed(2),
            paymentMode: order.paymentMode,
            ownerName: order.ownerName,
            orderItems: order.orderItems.map(item => {
                const dueDate = addDays(item.createdAt,15)
                const totalPrice = calculatePrice({
                    price: parseInt(item.price, 10),
                    quantity: item.quantity,
                    gst: item.gst,
                    discount: item.discount
                });

                return {
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    description: item.description,
                    gst: item.gst,
                    discount: item.discount,
                    address: item.isMeasurementAddress?.address,
                    city: item.isMeasurementAddress?.city,
                    country: item.isMeasurementAddress?.country,
                    state: item.isMeasurementAddress?.state,
                    pinCode: item.isMeasurementAddress?.pinCode,
                    totalPrice: parseFloat(totalPrice),
                    dueDate:dueDate
                };
            }),
            customerDetails:order.customerDetails
                
            }

        
        return formattedOrder;


    }

}    
