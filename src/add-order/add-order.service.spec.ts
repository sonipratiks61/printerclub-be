import { Test, TestingModule } from '@nestjs/testing';
import { AddOrderService } from './add-order.service';

describe('AddOrderService', () => {
  let service: AddOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddOrderService],
    }).compile();

    service = module.get<AddOrderService>(AddOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
