import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from '../user/dto/create-address.dto';
import { AuthGuard } from '@nestjs/passport';
import { NotFoundException } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { getCustomValidationError } from 'utils/validation/validationFunction';
import { ResponseService } from '../../utils/response/customResponse';
import { IdValidationPipe } from 'utils/validation/paramsValidation';
import { UpdateAddressDto } from 'src/user/dto/update-address.dto';
@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'Created.',
    type: CreateAddressDto,
  })
  @ApiBearerAuth()
  async create(
    @Res() res,
    @Req() req,
    @Body() createAddressDto: CreateAddressDto[],
  ) {
    try {
      const userId = req.user.id;
      await this.addressService.create(createAddressDto, userId);
      this.responseService.sendSuccess(res, 'Address Created Successfully');
    } catch (error) {
      console.log(error);
      if (error instanceof ValidationError) {
        const formattedError = getCustomValidationError([error]);
        this.responseService.sendBadRequest(
          res,
          'Validation error',
          formattedError,
        );
      } else {
        this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong',
          error,
        );
      }
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Addresses fetched successfully',
    type: CreateAddressDto,
    isArray: true,
  })
  async fetchAll(@Req() req, @Res() res) {
    try {
      const data = await this.addressService.findAllAddress();
      this.responseService.sendSuccess(res, 'Address Fetch Successfully', data);
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        error.message || 'Something Went Wrong',
        error,
      );
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Address updated successfully',
    type: CreateAddressDto,
  })
  @ApiNotFoundResponse({ description: 'Address not found' })
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Res() res,
    @Req() req,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    try {
      const updateAddressId = parseInt(id);
      const category = await this.addressService.findOne(updateAddressId);
      if (!category) {
        this.responseService.sendNotFound(res, 'Invalid address Id');
      }
      const data = await this.addressService.update(
        updateAddressId,
        updateAddressDto,
      );
      return this.responseService.sendSuccess(
        res,
        'Address Updated Successfully',
        data,
      );
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        return this.responseService.sendNotFound(res, error.message);
      } else {
        return this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong',
          error,
        );
      }
    }
  }

  @Get('findOne/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Address ID to delete', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Address successfully',
    type: CreateAddressDto,
  })
  @ApiNotFoundResponse({ description: 'Address not found' })
  async findOne(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const addressId = parseInt(id, 10);
      const data = await this.addressService.findOne(addressId);
      if (!data) {
        this.responseService.sendNotFound(
          res,
          `Address with ID ${id} not found`,
        );
      }
      this.responseService.sendSuccess(res, 'Fetch Address', data);
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      } else {
        this.responseService.sendInternalError(
          res,
          error.message || 'Something Went Wrong',
          error,
        );
      }
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Address ID to delete', type: 'string' })
  @ApiResponse({ status: 200, description: 'Address successfully removed' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async remove(@Param('id', IdValidationPipe) id: string, @Res() res) {
    try {
      const addressId = parseInt(id, 10);
      const data = await this.addressService.findOne(addressId);
      if (!data) {
        this.responseService.sendNotFound(
          res,
          `Address with ID ${id} not found`,
        );
      }
      await this.addressService.remove(addressId);
      this.responseService.sendSuccess(
        res,
        'Address Successfully Removed',
        data,
      );
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        this.responseService.sendNotFound(res, error.message);
      } else {
        this.responseService.sendInternalError(
          res,
          'Something Went Wrong',
          error,
        );
      }
    }
  }
}
