import { Module } from '@nestjs/common';
import { MazesController } from './mazes.controller';
import { MazesService } from './mazes.service';

@Module({
  controllers: [MazesController],
  providers: [MazesService]
})
export class MazesModule {}
