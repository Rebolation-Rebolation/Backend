import { Module } from '@nestjs/common';
import { ChampionshipsService } from './championships.service';
import { ChampionshipsController } from './championships.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ChampionshipsController],
  providers: [ChampionshipsService, PrismaService],
  exports: [ChampionshipsService],
})
export class ChampionshipsModule {}

