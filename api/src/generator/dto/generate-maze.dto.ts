import { IsInt, Min, Max } from 'class-validator';

export class GenerateDto {
  @IsInt()
  @Min(2)
  @Max(100)
  rows: number;

  @IsInt()
  @Min(2)
  @Max(100)
  cols: number;

  @IsInt()
  @Min(1)
  @Max(10)
  entrances: number;

  @IsInt()
  @Min(1)
  @Max(10)
  exits: number;
}
