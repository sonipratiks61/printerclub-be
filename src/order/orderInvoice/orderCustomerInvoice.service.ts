import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDetailsDto } from 'src/customer-details/dto/customer-details.dto';
import { ProductService } from 'src/product/product.service';
import { FinancialYear, generateInvoiceNumber } from 'utils/invoiceFunction/invoiceFunction';
import { calculateAttributesPrice, calculatePrice } from 'utils/calculatePriceFunction/calculatePriceFunction';
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
                        orderItemStatus:true,
                        isMeasurementAddress:true,
                        createdAt:true,
                        attributes: true,
                    },
                    where:{
                        orderItemStatus: {not: 'Cancelled'}
                    },
                }
            }
        });

        if (!order) {
            throw new NotFoundException("Order not found.");
        }
        const financialYear = await FinancialYear()

        const formattedInvoiceNumber = `${process.env.INVOICE_NUMBER_PREFIX}${financialYear}-${order.invoiceNumber}`;
        const dueDate = addDays(order.createdAt,15)
        const totalPayment = order.orderItems.reduce((total, item) => {
            const itemTotalPrice = calculatePrice({
                price: calculateAttributesPrice(item.attributes) ? parseInt(item.price, 10) * calculateAttributesPrice(item.attributes) : parseInt(item.price, 10),
                quantity: item.quantity,
                gst: item.gst,
                discount: item.discount
            });
            return total + parseFloat(itemTotalPrice);
        }, 0);

        const advancePayment = Number(order.advancePayment)?.toFixed(2);
        const remainingPayment = (totalPayment - parseFloat(advancePayment)).toFixed(2);

        const formattedOrder = {
            id: order.id,
            invoiceNumber: formattedInvoiceNumber,
            advancePayment:advancePayment,
            remainingPayment: remainingPayment ,
            totalPayment:Number(totalPayment).toFixed(2),
            paymentMode: order.paymentMode,
            ownerName: order.ownerName,
            dueDate:dueDate,
            orderItems: order.orderItems.map(item => {
                const totalPrice = calculatePrice({
                    price: calculateAttributesPrice(item.attributes) ? parseInt(item.price, 10) * calculateAttributesPrice(item.attributes): parseInt(item.price, 10),
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
                    orderItemStatus:item.orderItemStatus,
                    attributes: item.attributes,
                    
                };
            }),
            customerDetails:order.customerDetails
                
            }

        
        return formattedOrder;


    }

}    
