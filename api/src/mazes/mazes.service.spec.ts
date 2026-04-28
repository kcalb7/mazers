import { Test, TestingModule } from '@nestjs/testing';
import { MazesService } from './mazes.service';

describe('MazesService', () => {
  let service: MazesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MazesService],
    }).compile();

    service = module.get<MazesService>(MazesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
