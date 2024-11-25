// src/common/shared.module.ts
import { Module } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

@Module({
  exports: [PaginationDto],
})
export class SharedModule {}
