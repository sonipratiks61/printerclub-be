import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
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
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'Created.',
    type: CreateAddressDto,
  })
  @ApiBearerAuth()
  async create(@Req() req, @Body() createAddressDto: CreateAddressDto[]) {
    try {
      const userId = req.user.id;
      await this.addressService.create(createAddressDto, userId);
      return {
        success: true,
        message: 'Address Created Successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Validation failed', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
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
  async fetchAll(@Req() req) {
    try {
      console.log(req.user.id);
      const data = await this.addressService.findAllAddress();
      return {
        success: true,
        message: ' Address Fetch Successfully',
        data: data,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
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
    @Param('id') id: string,
    @Req() req,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    try {
      const updateAddressId = parseInt(id);
      const category = await this.addressService.findOne(updateAddressId);
      if (!category) {
        throw new NotFoundException('Invalid addressId');
      }
      const data = this.addressService.update(
        updateAddressId,
        createAddressDto,
      );
      return {
        success: true,
        message: 'Address updated successfully',
        data: data,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            success: false,
            message: error.message || 'Failed to remove address',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
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
    description: 'Address updated successfully',
    type: CreateAddressDto,
  })
  @ApiNotFoundResponse({ description: 'Address not found' })
  async findOne(@Param('id') id: string) {
    try {
      const addressId = parseInt(id, 10);
      const data = await this.addressService.findOne(addressId);
      if (!data) {
        throw new NotFoundException(`Address with ID ${id} not found`);
      }
      return { success: true, message: 'Address successfully ', data };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            success: false,
            message: error.message || 'Failed to remove address',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
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
  async remove(@Param('id') id: string) {
    try {
      const addressId = parseInt(id, 10);
      const data = await this.addressService.findOne(addressId);
      if (!data) {
        throw new NotFoundException(`Address with ID ${id} not found`);
      }
      await this.addressService.remove(addressId);
      return { success: true, message: 'Address successfully removed' };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          {
            success: false,
            message: error.message || 'Failed to remove address',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
