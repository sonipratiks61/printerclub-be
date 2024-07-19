import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ResponseService } from 'utils/response/customResponse';
import { AuthGuard } from '@nestjs/passport';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from 'utils/pagination/pagination';

@Controller('order')
export class OrderController {
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
            const owner = req.user.name;
            const userId=req.user.id;
            const data = await this.orderService.create(createOrderDto, owner,userId);
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
                this.responseService.sendInternalError(res, 'Error in Creating Customer Details');
            }
        }
    }


    @Get()
    @UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access this route
    async fetchAll(@Res() res,@Query() paginationDto: PaginationDto,) {
        try {
            const data = await this.orderService.findAll(paginationDto);
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
            const order = await this.orderService.findOne(orderId);
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
            if(data)
            
         {   this.responseService.sendSuccess(
                res,
                'Order Updated Successfully',
                data,
            );
        }    else{
            this.responseService.sendBadRequest(res,'Failed to Updated Successfully')
      
        }
        } catch (error) {
            console.log(error);
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
            if(!order)
            {
                this.responseService.sendNotFound(res,'Invalid Order Id');
            }
           const data =await this.orderService.remove(orderId);
           if(data)
           {
            this.responseService.sendSuccess(res, 'Order Deleted Successfully');
        } 
        else{
            this.responseService.sendBadRequest(res,'Failed to Delete Successfully');
        }
    }catch (error) {
            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',
            );
        }
    }
}