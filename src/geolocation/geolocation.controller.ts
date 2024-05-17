import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GeoLocationService } from './geolocation.service';
import { CreateAddressDto } from 'src/user/dto/create-address.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('geoLocation')
export class GeoLocationController {
  constructor(private readonly geoLocationService: GeoLocationService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get users with addresses successfully',
    type: [CreateAddressDto],
  })
  @ApiBearerAuth()
  async getUsersWithAddresses(@Query('pincode') pincode?: string) {
    try {
      const usersWithAddresses =
        await this.geoLocationService.findAllUsersWithAddresses(pincode);
      if (usersWithAddresses.length === 0) {
        throw new HttpException(
          {
            success: false,
            message: 'No found with the provided pincode',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return usersWithAddresses;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
