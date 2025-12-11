import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TrophiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(teamId?: string, championshipId?: string) {
    const where: Prisma.TrophyWhereInput = {};
    if (teamId) where.teamId = teamId;
    if (championshipId) where.championshipId = championshipId;

    return this.prisma.trophy.findMany({
      where,
      include: {
        championship: true,
        team: true,
      },
      orderBy: [
        { year: 'desc' },
        { position: 'asc' },
      ],
    });
  }
}

