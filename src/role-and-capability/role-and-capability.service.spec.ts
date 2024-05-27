import { Test, TestingModule } from '@nestjs/testing';
import { RoleAndCapabilityService } from './role-and-capability.service';

describe('RoleAndCapabilityService', () => {
  let service: RoleAndCapabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAndCapabilityService],
    }).compile();

    service = module.get<RoleAndCapabilityService>(RoleAndCapabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
