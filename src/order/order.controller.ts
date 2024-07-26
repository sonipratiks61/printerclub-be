import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ResponseService } from 'utils/response/customResponse';
import { AuthGuard } from '@nestjs/passport';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomerOrderInvoiceService } from './orderInvoice/orderCustomerInvoice.service';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService,
        private responseService: ResponseService,
        private customerOrderInvoiceService: CustomerOrderInvoiceService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Body() createOrderDto: CreateOrderDto,
        @Res() res,
        @Req() req
    ) {
        try {
            const owner = req.user.name;
            const userId = req.user.id;
            const data = await this.orderService.create(createOrderDto, owner, userId);
            if (data) {
                this.responseService.sendSuccess(res, 'Created Order Successfully', data);
            } else {
                this.responseService.sendBadRequest(res, "Failed to Created Order")
            }
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                this.responseService.sendBadRequest(res, error.message)
            }
            else {
                this.responseService.sendInternalError(res,'Something went wrong');
            }
        }
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async fetchAll(@Res() res) {
        try {
            const data = await this.orderService.findAll();
            this.responseService.sendSuccess(
                res,
                'Order Fetched Successfully',
                data,
            );
        } catch (error) {
            this.responseService.sendInternalError(
                res,
                'Something Went Wrong'
            );
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
        try {
            const orderId = parseInt(id, 10);
            const order = await this.orderService.findOne(orderId);
            if (!order) {
                this.responseService.sendNotFound(
                    res,
                    "Order Id Invalid",
                );
            }
            this.responseService.sendSuccess(res, 'Fetch Successfully', order);
        } catch (error) {
            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',
            );
            return;
        }
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(
        @Param('id', IdValidationPipe) id: string,
        @Body() createOrderDto: CreateOrderDto,
        @Res() res,
    ) {
        try {
            const orderId = parseInt(id, 10);
            const order = await this.orderService.findOne(orderId);
            if (!order) {
                this.responseService.sendNotFound(
                    res,
                    "Invalid Order Id",
                );
            }
            const data = await this.orderService.update(
                orderId,
                createOrderDto,
            );
            if (data) {
                this.responseService.sendSuccess(
                    res,
                    'Order Updated Successfully',
                    data,
                );
            } else {
                this.responseService.sendBadRequest(res, 'Failed to Updated Successfully');
            }
        } catch (error) {
            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',

            );

        }
    }

    @Get('invoice/:id')
    @UseGuards(AuthGuard('jwt'))
    async Invoice(@Param('id', IdValidationPipe) id: string, @Res() res) {
        try {
            const orderId = parseInt(id, 10);
            const Invoice = await this.customerOrderInvoiceService.customerOrderInvoice(orderId);
           if(Invoice){
           this.responseService.sendSuccess(res, 'Fetch Successfully', Invoice);
            }else{
                this.responseService.sendBadRequest(res,'Failed to Fetch Invoice');
            }
        } catch (error) {
            if(error instanceof(NotFoundException)){
                this.responseService.sendNotFound(res, error.message);
            }
            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',
            );
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
        try {
            const orderId = parseInt(id, 10);
            const order = await this.orderService.findOne(orderId);
            if (!order) {
                this.responseService.sendNotFound(res, 'Invalid Order Id');
            }
            const data = await this.orderService.remove(orderId);
            if (data) {
                this.responseService.sendSuccess(res, 'Order Deleted Successfully');
            }
            else {
                this.responseService.sendBadRequest(res, 'Failed to Delete Successfully');
            }
        } catch (error) {
            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',
            );
        }
    }
}
