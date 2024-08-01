import { Test, TestingModule } from '@nestjs/testing';
import { WorkFlowController } from './work-flow.controller';

describe('WorkFlowController', () => {
  let controller: WorkFlowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkFlowController],
    }).compile();

    controller = module.get<WorkFlowController>(WorkFlowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
