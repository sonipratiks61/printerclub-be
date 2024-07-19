import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { CreateOrderItemsDto } from './dto/create-order-Item.dto';
import { OrderItemsService } from './order-items.service';
import { ResponseService } from 'utils/response/customResponse';
import { PaginationDto } from 'utils/pagination/pagination';

@Controller('orderItems')
export class OrderItemsController {

    constructor(private orderItemsService: OrderItemsService,
        private responseService: ResponseService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async orderItemSearchByOrderId(@Query('orderId') orderId: string, @Res() res,@Query()paginationDto:PaginationDto) {
        try {
            const orderItemId = parseInt(orderId, 10);
            if(orderItemId)
            {const orderItems = await this.orderItemsService.orderItemsSearchByOrderId(orderItemId);
            if(orderItems){
                this.responseService.sendSuccess(res, "Fetch All OrderItems", orderItems);
            }
            else{
                this.responseService.sendBadRequest(res, "Failed to  Fetch OrderItems");
            }
       }
    else{
        const orderItems = await this.orderItemsService.findAll(paginationDto);
        this.responseService.sendSuccess(
            res,
            'OrderItems Fetched Successfully',
            orderItems,
        );
    } }
        catch (error) {
            if (error instanceof NotFoundException) {
                this.responseService.sendBadRequest(res, error.message);
            }
            else {
                console.log(error);
                this.responseService.sendInternalError(res, 'Something Went Wrong');
            }
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
        try {
            const orderItemId = parseInt(id, 10);
            const orderItem = await this.orderItemsService.findOne(orderItemId);
            if (!orderItem) {
                this.responseService.sendNotFound(
                    res,
                    "OrderItem Id Invalid",
                );
            }
            this.responseService.sendSuccess(res, 'Fetch Successfully', orderItem);
        } catch (error) {
            console.log(error);
            this.responseService.sendInternalError(
                res,
                error.message || 'Something Went Wrong',
            );
            return;
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
        const orderItemId = parseInt(id, 10);
        try {
           const data = await this.orderItemsService.remove(orderItemId);
           if(data)
           {
           this.responseService.sendSuccess(res, 'OrderItem Deleted Successfully');
           }
           else{
            this.responseService.sendBadRequest(res,'Failed to Deleted OrderItem');
           }
        } catch (error) {
            console.error(error);

            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',
            );
        }
    }
}