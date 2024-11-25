import { IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10)) 
  page: number;

  @IsInt()
  @Min(1)
  @Max(25)
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;
}
