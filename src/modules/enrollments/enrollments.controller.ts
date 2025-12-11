import { Controller, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentStatus } from '../../types/prisma.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Enrollments')
@Controller('championships/:championshipId/enroll')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post(':teamId')
  @ApiOperation({ summary: 'Inscrever time em campeonato' })
  enroll(
    @Param('championshipId') championshipId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.enrollmentsService.enroll(championshipId, teamId);
  }

  @Delete(':teamId')
  @ApiOperation({ summary: 'Cancelar inscrição' })
  cancel(
    @Param('championshipId') championshipId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.enrollmentsService.cancel(championshipId, teamId);
  }
}

@Controller('championships/:championshipId/enroll/:teamId')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EnrollmentStatusController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Patch('status')
  @ApiTags('Enrollments')
  @ApiOperation({ summary: 'Atualizar status da inscrição' })
  updateStatus(
    @Param('championshipId') championshipId: string,
    @Param('teamId') teamId: string,
    @Body() body: { status: EnrollmentStatus },
  ) {
    return this.enrollmentsService.updateStatus(championshipId, teamId, body.status);
  }
}

@Controller('championships/:championshipId/teams')
export class ChampionshipTeamsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @ApiTags('Championships')
  @ApiOperation({ summary: 'Listar times inscritos no campeonato' })
  async getTeams(@Param('championshipId') championshipId: string) {
    return this.enrollmentsService.findByChampionship(championshipId);
  }
}

