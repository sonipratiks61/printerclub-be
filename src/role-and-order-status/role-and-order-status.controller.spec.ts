import { Test, TestingModule } from '@nestjs/testing';
import { RoleAndOrderStatusController } from './role-and-order-status.controller';

describe('RoleAndOrderStatusController', () => {
  let controller: RoleAndOrderStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleAndOrderStatusController],
    }).compile();

    controller = module.get<RoleAndOrderStatusController>(RoleAndOrderStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
