import { Controller, Post, Body } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GenerateDto } from './dto/generate-maze.dto';

@Controller('generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post()
  generate(@Body() generateDto: GenerateDto) {
    return this.generatorService.generate(generateDto);
  }
}
