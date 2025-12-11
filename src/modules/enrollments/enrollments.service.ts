import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(championshipId: string, teamId: string) {
    const championship = await this.prisma.championship.findUnique({
      where: { id: championshipId },
      include: {
        enrollments: true,
      },
    });

    if (!championship) {
      throw new NotFoundException('Campeonato não encontrado');
    }

    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Time não encontrado');
    }

    // Verificar se já está inscrito
    const existingEnrollment = await this.prisma.championshipEnrollment.findUnique({
      where: {
        championshipId_teamId: {
          championshipId,
          teamId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Time já está inscrito neste campeonato');
    }

    // Verificar limite de times
    const enrolledCount = championship.enrollments.length;
    if (enrolledCount >= championship.teamLimit) {
      throw new BadRequestException('Limite de times atingido');
    }

    // Verificar se as inscrições estão abertas
    const now = new Date();
    if (now < championship.registrationStartDate || now > championship.registrationEndDate) {
      throw new BadRequestException('Período de inscrições encerrado');
    }

    return this.prisma.championshipEnrollment.create({
      data: {
        championshipId,
        teamId,
        status: 'pendente',
      },
    });
  }

  async updateStatus(championshipId: string, teamId: string, status: string) {
    const enrollment = await this.prisma.championshipEnrollment.findUnique({
      where: {
        championshipId_teamId: {
          championshipId,
          teamId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    return this.prisma.championshipEnrollment.update({
      where: {
        championshipId_teamId: {
          championshipId,
          teamId,
        },
      },
      data: { status: status as any },
    });
  }

  async cancel(championshipId: string, teamId: string): Promise<void> {
    const enrollment = await this.prisma.championshipEnrollment.findUnique({
      where: {
        championshipId_teamId: {
          championshipId,
          teamId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    await this.prisma.championshipEnrollment.delete({
      where: {
        championshipId_teamId: {
          championshipId,
          teamId,
        },
      },
    });
  }

  async findByChampionship(championshipId: string) {
    return this.prisma.championshipEnrollment.findMany({
      where: { championshipId },
      include: {
        team: {
          include: {
            category: true,
          },
        },
      },
    });
  }
}

