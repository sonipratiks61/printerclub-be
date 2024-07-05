import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ResponseService } from 'utils/response/customResponse';
import { AuthGuard } from '@nestjs/passport';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController  {
    constructor(private orderService: OrderService,
        private responseService: ResponseService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Body() createOrderDto: CreateOrderDto,
        @Res() res,
        @Req() req
    ) {
        try {
            const ownerName=req.user.name
            const data = await this.orderService.create(createOrderDto,ownerName);
            this.responseService.sendSuccess(res, 'Created Order Successfully', data);
        }
        catch (error) {
            console.log(error)
            if (error instanceof NotFoundException) {
                this.responseService.sendBadRequest(res, error.message)
            }
            else {
                this.responseService.sendInternalError(res, 'Error in Creating Customer Details');
            }
        }
    }


    @Get()
    @UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access this route
    async fetchAll(@Res() res) {
        try {
            const data= await this.orderService.findAll();
            this.responseService.sendSuccess(
                res,
                'Order Fetched Successfully',
                data,
            );
        } catch (error) {
            this.responseService.sendInternalError(
                res,
                error.message || 'Something Went Wrong'
            );
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
        try {
            const orderId = parseInt(id, 10);
            const order= await this.orderService.findOne(orderId);
            if (!order) {
                this.responseService.sendNotFound(
                    res,
                    "Order Id Invalid",
                );
            }
            this.responseService.sendSuccess(res, 'Fetch Successfully', order);
        } catch (error) {
            console.log(error);
            this.responseService.sendInternalError(
                res,
                error.message || 'Something Went Wrong',
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
            this.responseService.sendSuccess(
                res,
                'Order Updated Successfully',
                data,
            );
        } catch (error) {
            console.log(error);
            this.responseService.sendInternalError(
                res,
                error.message || 'Something Went Wrong',

            );

        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
        try {
            const orderId = parseInt(id, 10);
            await this.orderService.remove(orderId);
            this.responseService.sendSuccess(res, 'Order Deleted Successfully');
        } catch (error) {
            console.error(error);

            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',
            );
        }
    }
}