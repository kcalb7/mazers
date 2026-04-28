import { Injectable } from '@nestjs/common';
import { GenerateDto } from './dto/generate-maze.dto';
import { RecursiveBacktracking } from './algorithms/recursive-backtracking';

@Injectable()
export class GeneratorService {
  generate(dto: GenerateDto) {
    const { rows, cols, entrances, exits } = dto;
    const grid = RecursiveBacktracking.generate(rows, cols, entrances, exits);
    
    return {
      rows,
      cols,
      entrances,
      exits,
      grid
    };
  }
}
