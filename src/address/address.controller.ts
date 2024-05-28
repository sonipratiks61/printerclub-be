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
import { getCustomValidationError } from 'utils/validationFunction';
import { ResponseService } from '../../utils/response/customResponse';
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
      return;
    } catch (error) {
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
          error.message || 'something went wrong',
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
      return;
    } catch (error) {
      this.responseService.sendInternalError(
        res,
        error.message || 'something went wrong',
        error,
      );
      return;
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
    @Param('id') id: string,
    @Req() req,
    @Body() createAddressDto: CreateAddressDto,
    @Res() res,
  ) {
    try {
      const updateAddressId = parseInt(id);
      const category = await this.addressService.findOne(updateAddressId);
      if (!category) {
        return this.responseService.sendNotFound(res, 'Invalid addressId');
      }
      const data = await this.addressService.update(
        updateAddressId,
        createAddressDto,
      );
      return this.responseService.sendSuccess(
        res,
        'Address updated successfully',
        data,
      );
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        return this.responseService.sendNotFound(res, error.message);
      } else {
        return this.responseService.sendInternalError(
          res,
          error.message || 'something went wrong',
          error,
        );
      }
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Address ID to delete', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Address successfully',
    type: CreateAddressDto,
  })
  @ApiNotFoundResponse({ description: 'Address not found' })
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const addressId = parseInt(id, 10);
      const data = await this.addressService.findOne(addressId);
      if (!data) {
        return this.responseService.sendNotFound(
          res,
          `Address with ID ${id} not found`,
        );
      }
      this.responseService.sendSuccess(res, 'fetch Address', data);
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        return this.responseService.sendNotFound(res, error.message);
      } else {
        return this.responseService.sendInternalError(
          res,
          error.message || 'something went wrong',
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
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const addressId = parseInt(id, 10);
      const data = await this.addressService.findOne(addressId);
      if (!data) {
        throw new NotFoundException(`Address with ID ${id} not found`);
      }
      await this.addressService.remove(addressId);
      return this.responseService.sendSuccess(
        res,
        'Address successfully removed',
        data,
      );
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        return this.responseService.sendNotFound(res, error.message);
      } else {
        return this.responseService.sendInternalError(
          res,
          error.message || 'something went wrong',
          error,
        );
      }
    }
  }
}
