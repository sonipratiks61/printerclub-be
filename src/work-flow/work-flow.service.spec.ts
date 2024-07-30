import { Test, TestingModule } from '@nestjs/testing';
import { WorkFlowService } from './work-flow.service';

describe('WorkFlowService', () => {
  let service: WorkFlowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkFlowService],
    }).compile();

    service = module.get<WorkFlowService>(WorkFlowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
