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
    let newInvoiceNumber;

    if (lastOrder) {
        const lastInvoiceNumber = lastOrder.invoiceNumber;
        newInvoiceNumber = lastInvoiceNumber + 1;
    } else {
        newInvoiceNumber = 1;
        return newInvoiceNumber;
    }
}

export async function FinancialYear() {
    try {

        const financialYear = await getLastInvoiceNumber();

        if (financialYear) {
            const lastInvoiceYear = financialYear.createdAt.getFullYear();
            const financialYearStart = new Date(lastInvoiceYear, 3, 1); // April 1st of lastInvoiceYear
            const financialYearEnd = new Date(lastInvoiceYear + 1, 2, 31); // March 31st of next year after lastInvoiceYear

            const currentDate = new Date();
            if (currentDate >= financialYearStart && currentDate <= financialYearEnd) {
                const formattedFinancialYear = `${lastInvoiceYear}-${(lastInvoiceYear % 100) + 1}`;
                return formattedFinancialYear;
            }
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}
