import { Controller, Get, Query, Res } from '@nestjs/common';
import { GeoLocationService } from './geolocation.service';
import { ResponseService } from '../../utils/response/customResponse'; // Import the ResponseService
import { getCustomValidationError } from '../../utils/validation/validationFunction'; // Import utility function
import { Response } from 'express'; // Import Response
import { ValidationError } from 'class-validator';

@Controller('geoLocation')
export class GeoLocationController {
  constructor(
    private readonly geoLocationService: GeoLocationService,
    private readonly responseService: ResponseService, // Inject the ResponseService
  ) {}

  @Get()
  async getUsersWithAddresses(
    @Res() res: Response,
    @Query('pincode') pincode?: string,
  ) {
    try {
      const usersWithAddresses =
        await this.geoLocationService.findAllUsersWithAddresses(pincode);
      if (usersWithAddresses.length === 0) {
        this.responseService.sendNotFound(
          res,
          'No users found with the provided pincode',
        );
      } else {
        this.responseService.sendSuccess(
          res,
          'Fetch the pincode',
          usersWithAddresses,
        );
        return;
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        const formattedError = getCustomValidationError([error]);
        this.responseService.sendBadRequest(
          res,
          'Validation error',
          formattedError,
        );
      } else {
        this.responseService.sendInternalError(res, error.message, error);
      }
    }
  }
}
