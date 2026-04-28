import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMazeDto } from './dto/create-maze.dto';
import { UpdateMazeDto } from './dto/update-maze.dto';

@Injectable()
export class MazesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMazeDto: CreateMazeDto) {
    return this.prisma.maze.create({
      data: createMazeDto,
    });
  }

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.maze.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.maze.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const maze = await this.prisma.maze.findUnique({
      where: { id },
    });
    if (!maze) throw new NotFoundException(`Maze with ID ${id} not found`);
    return maze;
  }

  async update(id: string, updateMazeDto: UpdateMazeDto) {
    await this.findOne(id); // verifications
    return this.prisma.maze.update({
      where: { id },
      data: updateMazeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.maze.delete({
      where: { id },
    });
  }
}
