import {
  Controller,
  Get,
  Query,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GeoLocationService } from './geolocation.service';

@Controller('geoLocation')
export class GeoLocationController {
  constructor(private readonly geoLocationService: GeoLocationService) {}

  @Get()
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
