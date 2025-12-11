import { Module } from '@nestjs/common';
import { SportCategoriesService } from './sport-categories.service';
import { SportCategoriesController } from './sport-categories.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SportCategoriesController],
  providers: [SportCategoriesService, PrismaService],
  exports: [SportCategoriesService],
})
export class SportCategoriesModule {}

