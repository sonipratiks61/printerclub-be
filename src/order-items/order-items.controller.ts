import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { CreateOrderItemsDto } from './dto/create-order-Item.dto';
import { OrderItemsService } from './order-items.service';
import { ResponseService } from 'utils/response/customResponse';

@Controller('orderItems')
export class OrderItemsController {

    constructor(private orderItemsService: OrderItemsService,
        private responseService: ResponseService) { }

    // @Post()
    // @UseGuards(AuthGuard('jwt'))
    // async create(
    //     @Body() createOrderItemsDto: CreateOrderItemsDto[],
    //     @Res() res,
    //     @Req() req
    // ) {
    //     try {
    //         const ownerName = req.user.name;
    //         await this.orderItemsService.create(createOrderItemsDto, ownerName);
    //         this.responseService.sendSuccess(res, 'Created Order Items Successfully');
    //     }
    //     catch (error) {
    //         console.log(error)
    //         if (error instanceof NotFoundException) {
    //             this.responseService.sendBadRequest(res, error.message)
    //         }
    //         else {
    //             this.responseService.sendInternalError(res, 'Error in Creating Customer Details');
    //         }
    //     }
    // }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async orderItemSearchByOrderId(@Query('orderId') orderId: string, @Res() res) {
        try {
            const orderItemId = parseInt(orderId, 10);
            if(orderItemId)
            {const orderItems = await this.orderItemsService.orderItemsSearchByOrderId(orderItemId);
            this.responseService.sendSuccess(res, "Fetch All OrderItems", orderItems);
       }
    else{
        const orderItems = await this.orderItemsService.findAll();
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

    // @Put(':id')
    // @UseGuards(AuthGuard('jwt'))
    // async update(
    //     @Param('id', IdValidationPipe) id: string,
    //     @Body() createOrderItemsDto: CreateOrderItemsDto,
    //     @Res() res,
    // ) {
    //     try {
    //         const categoryId = parseInt(id, 10);
    //         const category = await this.orderItemsService.findOne(categoryId);
    //         if (!category) {
    //             this.responseService.sendNotFound(
    //                 res,
    //                 'Invalid OrderItem Id ',
    //             );
    //         }
    //         const updatedCategory = await this.orderItemsService.update(
    //             categoryId,
    //             createOrderItemsDto,
    //         );
    //         this.responseService.sendSuccess(
    //             res,
    //             'OrderItem Updated Successfully',
    //             updatedCategory,
    //         );
    //     } catch (error) {
    //         console.log(error);
    //         this.responseService.sendInternalError(
    //             res,
    //             error.message || 'Something Went Wrong',

    //         );

    //     }
    // }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
        const orderItemId = parseInt(id, 10);
        try {


            await this.orderItemsService.remove(orderItemId);
            this.responseService.sendSuccess(res, 'OrderItem Deleted Successfully');
        } catch (error) {
            console.error(error);

            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',
            );
        }
    }
}