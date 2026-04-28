import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MazesService } from './mazes.service';
import { CreateMazeDto } from './dto/create-maze.dto';
import { UpdateMazeDto } from './dto/update-maze.dto';

@Controller('mazes')
export class MazesController {
  constructor(private readonly mazesService: MazesService) {}

  @Post()
  create(@Body() createMazeDto: CreateMazeDto) {
    return this.mazesService.create(createMazeDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.mazesService.findAll(page ? +page : 1, limit ? +limit : 10);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mazesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMazeDto: UpdateMazeDto) {
    return this.mazesService.update(id, updateMazeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mazesService.remove(id);
  }
}
