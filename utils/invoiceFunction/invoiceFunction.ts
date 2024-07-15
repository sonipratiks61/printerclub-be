import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function getLastInvoiceNumber(){
    const lastOrder = await  prisma.order.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        invoiceNumber: true,
      },
    });
    return lastOrder ? lastOrder.invoiceNumber : 0;
  }
  
   export async function generateInvoiceNumber() {
    const lastInvoiceNumber = await getLastInvoiceNumber();
    return lastInvoiceNumber +1;
  }