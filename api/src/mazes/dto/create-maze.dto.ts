import { IsString, IsInt, IsOptional, Max, Min, IsObject, ValidateNested } from 'class-validator';

export class CreateMazeDto {
  @IsOptional()
  @IsString()
  alias?: string;

  @IsInt()
  @Min(2)
  @Max(100)
  rows: number;

  @IsInt()
  @Min(2)
  @Max(100)
  cols: number;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(200)
  tileSize?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  entrances?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  exits?: number;

  @IsObject()
  grid: Record<string, any>; // JSON content validated loosely, further strict constraints could be handled
}
