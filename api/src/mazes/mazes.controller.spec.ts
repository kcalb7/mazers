import { Test, TestingModule } from '@nestjs/testing';
import { MazesController } from './mazes.controller';

describe('MazesController', () => {
  let controller: MazesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MazesController],
    }).compile();

    controller = module.get<MazesController>(MazesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
