import { BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getLastInvoiceNumber() {
    const lastOrder = await prisma.order.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            invoiceNumber: true,
            createdAt: true, 
        },
    });

    return lastOrder;
}

export async function generateInvoiceNumber() {
    const lastOrder = await getLastInvoiceNumber();
    const currentYear = new Date().getFullYear();
    const prefix = `#AKC${currentYear}-`;

    let newInvoiceNumber;

    if (lastOrder) {
        const lastInvoiceNumber = lastOrder.invoiceNumber;
        const lastYear = lastOrder.createdAt.getFullYear();

        if (lastYear === currentYear) {
            const match = lastInvoiceNumber.match(/(\d+)$/);
            if (match) {
                const lastNumber = parseInt(match[0], 10);
                const newNumber = lastNumber + 1;
                newInvoiceNumber = `${prefix}${newNumber.toString().padStart(2, '0')}`;
            } else {
               
                throw new BadRequestException('Invalid invoice number format.');
            }
        } else {
                   newInvoiceNumber = `${prefix}01`;
        }
    } else {
        newInvoiceNumber = `${prefix}01`;
    }

    return newInvoiceNumber;
}


