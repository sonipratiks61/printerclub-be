import { Test, TestingModule } from '@nestjs/testing';
import { RoleAndCapabilityController } from './role-and-capability.controller';

describe('RoleAndCapabilityController', () => {
  let controller: RoleAndCapabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleAndCapabilityController],
    }).compile();

    controller = module.get<RoleAndCapabilityController>(
      RoleAndCapabilityController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
