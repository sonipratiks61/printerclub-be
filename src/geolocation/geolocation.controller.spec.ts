import { Test, TestingModule } from '@nestjs/testing';
import { GeoLocationController } from './geolocation.controller';

describe('GeolocationController', () => {
  let controller: GeoLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoLocationController],
    }).compile();

    controller = module.get<GeoLocationController>(GeoLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
