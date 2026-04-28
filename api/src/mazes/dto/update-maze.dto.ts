import { PartialType } from '@nestjs/mapped-types';
import { CreateMazeDto } from './create-maze.dto';

export class UpdateMazeDto extends PartialType(CreateMazeDto) {}
