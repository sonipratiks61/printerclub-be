import { Test, TestingModule } from '@nestjs/testing';
import { RoleAndOrderStatusService } from './role-and-order-status.service';

describe('RoleAndOrderStatusService', () => {
  let service: RoleAndOrderStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAndOrderStatusService],
    }).compile();

    service = module.get<RoleAndOrderStatusService>(RoleAndOrderStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
