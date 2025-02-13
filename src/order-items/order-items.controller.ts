import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { CreateOrderItemsDto, UpdateOrderItemDto } from './dto/order-Item.dto';
import { OrderItemsService } from './order-items.service';
import { ResponseService } from 'utils/response/customResponse';
import { UserService } from 'src/user/user.service';

@Controller('orderItems')
export class OrderItemsController {

    constructor(private orderItemsService: OrderItemsService, private usersService: UserService,
        private responseService: ResponseService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async orderItemSearchByOrderId(@Query('orderId') orderId: string, @Res() res) {
        try {
            const orderItemId = parseInt(orderId, 10);
            if (orderItemId) {
                const orderItems = await this.orderItemsService.orderItemsSearchByOrderId(orderItemId);
                if (orderItems) {
                    this.responseService.sendSuccess(res, "Fetch All OrderItems", orderItems);
                }
                else {
                    this.responseService.sendBadRequest(res, "Failed to  Fetch OrderItems");
                }
            }
            else {
                const orderItems = await this.orderItemsService.findAll();
                this.responseService.sendSuccess(
                    res,
                    'OrderItems Fetched Successfully',
                    orderItems,
                );
            }
        }
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
    
    @Post('/assignTo/:id')
    @UseGuards(AuthGuard('jwt'))
    async assignTo(
      @Param('id') id: string,
      @Body() body: { assignTo: number; expectedBy: string },
      @Res() res
    ) {
      try {
        const orderItemId = parseInt(id, 10);
        if (isNaN(orderItemId)) {
          return this.responseService.sendBadRequest(res, 'Invalid Order Item ID');
        }
    
        const orderItem = await this.orderItemsService.findOne(orderItemId);
        if (!orderItem) {
          return this.responseService.sendNotFound(res, 'OrderItem Id Invalid');
        }

        const user = await this.usersService.findOne(Number(body.assignTo));
        if (!user) {
          return this.responseService.sendNotFound(res, 'User Not Found');
        }
    
        const updatedOrderItem = await this.orderItemsService.assignToUser(
          orderItemId,
          Number(body.assignTo),
          body.expectedBy
        );
    
        return this.responseService.sendSuccess(
          res,
          'Order Item Assigned Successfully',
          updatedOrderItem
        );
      } catch (error) {
        return this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong'
        );
      }
    }
    

    @Get(':id')
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
            this.responseService.sendInternalError(
                res,
                error.message || 'Something Went Wrong',
            );
            return;
        }
    }
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateOrderItemStatus(@Param('id', IdValidationPipe) id: string, @Body() updateOrderItemDto: UpdateOrderItemDto, @Res() res, @Req() req) {
        try {
            const orderItemId = parseInt(id, 10);
            const orderItemStatus = await this.orderItemsService.findOne(orderItemId);
            if (!orderItemStatus) {
                this.responseService.sendNotFound(res, 'OrderItem Id Invalid');
            }
            const updatedOrderItem = await this.orderItemsService.updateOrderItemStatus(orderItemId, updateOrderItemDto);
            if (updatedOrderItem) {
                this.responseService.sendSuccess(res, 'Cancelled Successfully', updatedOrderItem)
            }
            else {
                this.responseService.sendBadRequest(res, 'OrderItem Id Invalid');

            }
        } catch (error) {
            if (error instanceof ConflictException) {
                this.responseService.sendConflict(res, error.message)
            }

            else if (error instanceof NotFoundException) {
                this.responseService.sendNotFound(res, error.message)
            }
            else if (error instanceof BadRequestException) {
                this.responseService.sendBadRequest(res, error.message)
            }
            else {
                this.responseService.sendInternalError(res, 'Something Went Wrong');
            }
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
        try {
            const orderItemId = parseInt(id, 10);
            const data = await this.orderItemsService.remove(orderItemId);
            if (data) {
                this.responseService.sendSuccess(res, 'OrderItem Deleted Successfully');
            }
            else {
                this.responseService.sendBadRequest(res, 'Failed to Deleted OrderItem');
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