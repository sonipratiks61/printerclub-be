
import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ResponseService } from 'utils/response/customResponse';
import { AuthGuard } from '@nestjs/passport';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { CreateOrderHistoryDto } from './dto/order-history.dto';
import { OrderHistoryService } from './order-history.service';

@Controller('orderHistory')
export class OrderHistoryController  {
    constructor(private orderHistoryService: OrderHistoryService,
        private responseService: ResponseService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Body() createOrderHistoryDto: CreateOrderHistoryDto,
        @Res() res,
        @Req() req
    ) {
        try {
            const data = await this.orderHistoryService.create(createOrderHistoryDto);
           if(data){
            this.responseService.sendSuccess(res, 'Status Updated Successfully', data);
        }
        else{
            this.responseService.sendBadRequest(res, 'Failed to Create OrderHistory');
        }
    }
        catch (error) {
            if (error instanceof NotFoundException) {
                this.responseService.sendNotFound(res, error.message)
            }
            else if (error instanceof ConflictException) {
                this.responseService.sendConflict(res, error.message)
            }
            else if(error instanceof BadRequestException) {
                this.responseService.sendConflict(res, error.message)
            }
            else {
                this.responseService.sendInternalError(res, 'Something Went Wrong');
            }
        }
    }

    @Get()
    @UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access this route
    async fetchAll(@Query('orderId') orderId: string, @Res() res) {
        try {
            const id= parseInt(orderId, 10);
            let data;
            if (orderId) {
                data = await this.orderHistoryService.findOrderItemById(id);
            } else {
                data = await this.orderHistoryService.findAll();
            }
            this.responseService.sendSuccess(
                res,
                'OrderHistory Fetched Successfully',
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
            const orderHistoryId= parseInt(id, 10);
            const orderHistory= await this.orderHistoryService.findOne(orderHistoryId);
            if (!orderHistory) {
                this.responseService.sendNotFound(
                    res,
                    "Invalid OrderHistoryId",
                );
            }
            this.responseService.sendSuccess(res, 'Fetch Successfully', orderHistory);
        } catch (error) {
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
        @Body() createOrderHistoryDto: CreateOrderHistoryDto,
        @Res() res,
    ) {
        try {
            const orderHistoryId = parseInt(id, 10);
            const orderHistory = await this.orderHistoryService.findOne(orderHistoryId);
            if (!orderHistory) {
                this.responseService.sendNotFound(
                    res,
                    "Invalid OrderHistory Id",
                );
            }
            const data = await this.orderHistoryService.update(
                orderHistoryId,
                createOrderHistoryDto,
            );
            if(data){
            this.responseService.sendSuccess(
                res,
                'OrderHistory Updated Successfully',
                data,
            );
            }
            else{
                this.responseService.sendBadRequest(res,'Failed to Updated OrderHistory');
            }
        } catch (error) {
            this.responseService.sendInternalError(
                res,
                error.message || 'Something Went Wrong',

            );

        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
        const orderId = parseInt(id, 10);
        try {


            await this.orderHistoryService.remove(orderId);
            this.responseService.sendSuccess(res, 'OrderHistory Deleted Successfully');
        } catch (error) {
            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',
            );
        }
    }
}