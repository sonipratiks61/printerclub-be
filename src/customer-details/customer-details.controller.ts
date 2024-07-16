import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { CustomerDetailsService } from './customer-details.service';
import { CreateCustomerDetailsDto, UpdateCustomerDetailsDto } from './dto/customer-details.dto';
import { ResponseService } from 'utils/response/customResponse';
import { AuthGuard } from '@nestjs/passport';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { UpdateCategoryDto } from 'src/category/dto/update.category.dto';

@Controller('customerDetails')
export class CustomerDetailsController {
    constructor(private customerDetailsService: CustomerDetailsService,
        private responseService: ResponseService) { }

    @Get()
    @UseGuards(AuthGuard('jwt')) // Ensures only authenticated users can access this route
    async fetchAll(@Res() res) {
        try {
            const categories = await this.customerDetailsService.findAll();
            this.responseService.sendSuccess(
                res,
                'CustomerDetails Fetched Successfully',
                categories,
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
            const customerDetailsId = parseInt(id, 10);
            const customerDetails = await this.customerDetailsService.findOne(customerDetailsId);
            if (!customerDetails) {
                this.responseService.sendNotFound(
                    res,
                    "Invalid CustomerDetails Id",
                );
            }
            this.responseService.sendSuccess(res, 'Fetch Successfully', customerDetails);
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
        @Body() updateCustomerDetailsDto: UpdateCustomerDetailsDto,
        @Res() res,
    ) {
        try {
            const customerDetailsId = parseInt(id, 10);
            const customerDetails = await this.customerDetailsService.findOne(customerDetailsId);
            if (!customerDetails) {
                this.responseService.sendNotFound(
                    res,
                    "Invalid CustomerDetails Id "
                );
            }
            const updatedCustomerDetails = await this.customerDetailsService.update(
                customerDetailsId,
                updateCustomerDetailsDto,
            );
            if (updatedCustomerDetails) {
                this.responseService.sendSuccess(
                    res,
                    'CustomerDetails Updated Successfully',
                    updatedCustomerDetails,
                );
            }
            else {
                this.responseService.sendBadRequest(
                    res,
                    'Failed to Updated CustomerDetails',);

            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.responseService.sendBadRequest(res, error.message)
            }
            else {
                this.responseService.sendInternalError(res, 'Error in Creating Customer Details');
            }
        }
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
        try {
            const customerDetailsId = parseInt(id, 10);
            const customerDetails = await this.customerDetailsService.findOne(customerDetailsId);
            if (!customerDetails) {
                this.responseService.sendNotFound(
                    res,
                    "Invalid CustomerDetails Id "
                );
            }
          const data=await this.customerDetailsService.remove(customerDetailsId);
            if(data){
                this.responseService.sendSuccess(res, 'CustomerDetails Deleted Successfully');
            }
            else{
                this.responseService.sendBadRequest(res, 'Failed to Delete CustomerDetails');
            }
        } catch (error) {
            this.responseService.sendInternalError(
                res,
                'Something Went Wrong',
            );
        }
    }
}