import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, Res, Put } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { CreateOrderStatusDto, UpdateOrderStatusDto } from './dto/order-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResponseService } from 'utils/response/customResponse';
import { IdValidationPipe } from 'utils/validation/paramsValidation';

@Controller('orderStatus')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService,
    private responseService: ResponseService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createOrderStatusDto: CreateOrderStatusDto, @Res() res) {
    try {
      await this.orderStatusService.create(createOrderStatusDto);
      this.responseService.sendSuccess(res, 'Created Order Status Successfully');
    }
    catch (error) {
      this.responseService.sendInternalError(res, 'Something Went Wrong');

    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Res() res) {
    try {
      const data=await this.orderStatusService.findAll();
      this.responseService.sendSuccess(res, 'Fetch All Successfully',data);
    } catch (error) {
      this.responseService.sendInternalError(res, 'Something Went Wrong');

    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const orderStatusId = parseInt(id, 10);
      const data=await this.orderStatusService.findOne(orderStatusId);
      this.responseService.sendSuccess(res, 'OrderStatus Fetch Successfully',data);
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
      );
    }
  }

  @Put(':id')
  async update(@Param('id', IdValidationPipe) id: string, @Res() res, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const orderStatusId = parseInt(id, 10);
      const orderStatus = await this.orderStatusService.findOne(orderStatusId);
      
      if (!orderStatus) {
        this.responseService.sendNotFound(res, "Invalid OrderStatus Id");
      }
      await this.orderStatusService.update(orderStatusId, updateOrderStatusDto);
      this.responseService.sendSuccess(res, 'OrderStatus Updated Successfully');
    }
    catch (error) {
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
      const orderStatusId = parseInt(id, 10);
      const orderStatus = await this.orderStatusService.findOne(orderStatusId);
      if (!orderStatus) {
        this.responseService.sendNotFound(
          res,
          'Invalid OrderStatus Id ',
        );
      }
    const data=  await this.orderStatusService.remove(orderStatusId);
      this.responseService.sendSuccess(res, 'OrderStatus Deleted Successfully',data);
    }
    catch (error) {
      this.responseService.sendInternalError(
        res,
        'Something Went Wrong',
      );
    }
  }
}
