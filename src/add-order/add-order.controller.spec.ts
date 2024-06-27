import { Test, TestingModule } from '@nestjs/testing';
import { AddOrderController } from './add-order.controller';

describe('AddOrderController', () => {
  let controller: AddOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddOrderController],
    }).compile();

    controller = module.get<AddOrderController>(AddOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
