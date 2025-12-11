import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController, ChampionshipTeamsController, EnrollmentStatusController } from './enrollments.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EnrollmentsController, ChampionshipTeamsController, EnrollmentStatusController],
  providers: [EnrollmentsService, PrismaService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}

