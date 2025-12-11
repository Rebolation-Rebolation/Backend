import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchStatus } from '../../types/prisma.types';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcula o status da partida baseado em data e hora
   */
  private calculateMatchStatus(
    date: Date | string,
    startTime: Date | string,
    endTime: Date | string | null,
  ): MatchStatus {
    const now = new Date();
    const matchDate = new Date(date);
    matchDate.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Converter startTime para Date se necessário
    let startDateTime: Date;
    if (startTime instanceof Date) {
      startDateTime = new Date(matchDate);
      startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    } else {
      // String no formato HH:mm ou HH:mm:ss
      const timeStr = startTime.toString();
      const [hours, minutes] = timeStr.split(':').map(Number);
      startDateTime = new Date(matchDate);
      startDateTime.setHours(hours || 0, minutes || 0, 0, 0);
    }

    // Converter endTime para Date se necessário
    let endDateTime: Date | null = null;
    if (endTime) {
      if (endTime instanceof Date) {
        endDateTime = new Date(matchDate);
        endDateTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
      } else {
        const timeStr = endTime.toString();
        const [endHours, endMinutes] = timeStr.split(':').map(Number);
        endDateTime = new Date(matchDate);
        endDateTime.setHours(endHours || 0, endMinutes || 0, 0, 0);
      }
    }

    // Partida já passou
    if (today > matchDate || (today.getTime() === matchDate.getTime() && endDateTime && now >= endDateTime)) {
      return 'finalizada';
    }

    // Partida está em andamento
    if (today.getTime() === matchDate.getTime() && now >= startDateTime && (!endDateTime || now < endDateTime)) {
      return 'em_andamento';
    }

    // Partida agendada
    return 'agendada';
  }

  async create(createMatchDto: CreateMatchDto) {
    // Verificar se campeonato existe
    const championship = await this.prisma.championship.findUnique({
      where: { id: createMatchDto.championshipId },
    });
    if (!championship) {
      throw new NotFoundException('Campeonato não encontrado');
    }

    // Verificar se times existem
    const [homeTeam, awayTeam] = await Promise.all([
      this.prisma.team.findUnique({ where: { id: createMatchDto.homeTeamId } }),
      this.prisma.team.findUnique({ where: { id: createMatchDto.awayTeamId } }),
    ]);

    if (!homeTeam || !awayTeam) {
      throw new NotFoundException('Time não encontrado');
    }

    if (homeTeam.id === awayTeam.id) {
      throw new BadRequestException('Time da casa e visitante não podem ser o mesmo');
    }

    // Preparar datas
    const date = new Date(createMatchDto.date);
    const startTime = new Date(`${createMatchDto.date}T${createMatchDto.startTime}`);
    const endTime = createMatchDto.endTime ? new Date(`${createMatchDto.date}T${createMatchDto.endTime}`) : null;

    // Calcular status se não fornecido
    const calculatedStatus = createMatchDto.status || 
      this.calculateMatchStatus(date, startTime, endTime);

    return this.prisma.match.create({
      data: {
        championshipId: createMatchDto.championshipId,
        homeTeamId: createMatchDto.homeTeamId,
        awayTeamId: createMatchDto.awayTeamId,
        type: createMatchDto.type,
        title: createMatchDto.title,
        date,
        startTime,
        endTime,
        local: createMatchDto.local,
        homeScore: createMatchDto.homeScore || 0,
        awayScore: createMatchDto.awayScore || 0,
        status: calculatedStatus as any,
      },
      include: {
        championship: true,
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  async findAll(championshipId?: string) {
    const where = championshipId ? { championshipId } : {};
    const matches = await this.prisma.match.findMany({
      where,
      include: {
        championship: true,
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    // Recalcular e atualizar status se necessário
    return matches.map((match) => {
      const calculatedStatus = this.calculateMatchStatus(
        match.date,
        match.startTime,
        match.endTime,
      );

      if (match.status !== calculatedStatus) {
        // Atualizar assincronamente
        this.prisma.match.update({
          where: { id: match.id },
          data: { status: calculatedStatus as any },
        }).catch(() => {
          // Ignorar erros
        });
      }

      return {
        ...match,
        status: calculatedStatus,
      };
    });
  }

  async findOne(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        championship: true,
        homeTeam: true,
        awayTeam: true,
      },
    });

    if (!match) {
      throw new NotFoundException('Partida não encontrada');
    }

    // Recalcular e atualizar status se necessário
    const calculatedStatus = this.calculateMatchStatus(
      match.date,
      match.startTime,
      match.endTime,
    );

    if (match.status !== calculatedStatus) {
      await this.prisma.match.update({
        where: { id },
        data: { status: calculatedStatus as any },
      });
      match.status = calculatedStatus;
    }

    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    await this.findOne(id);

    const updateData: any = { ...updateMatchDto };

    // Preparar datas se fornecidas
    let date = updateMatchDto.date ? new Date(updateMatchDto.date) : undefined;
    let startTime = updateMatchDto.startTime ? new Date(`${updateMatchDto.date || ''}T${updateMatchDto.startTime}`) : undefined;
    let endTime = updateMatchDto.endTime ? new Date(`${updateMatchDto.date || ''}T${updateMatchDto.endTime}`) : undefined;

    if (updateMatchDto.date) {
      updateData.date = date;
    }
    if (updateMatchDto.startTime) {
      updateData.startTime = startTime;
    }
    if (updateMatchDto.endTime) {
      updateData.endTime = endTime;
    }

    // Buscar partida atual para calcular status se necessário
    const currentMatch = await this.prisma.match.findUnique({ where: { id } });
    if (currentMatch) {
      const finalDate = date || currentMatch.date;
      const finalStartTime = startTime || currentMatch.startTime;
      const finalEndTime = endTime !== undefined ? endTime : currentMatch.endTime;

      // Recalcular status se datas foram alteradas ou status não foi fornecido
      if (!updateMatchDto.status || updateMatchDto.date || updateMatchDto.startTime || updateMatchDto.endTime) {
        updateData.status = this.calculateMatchStatus(
          finalDate,
          finalStartTime,
          finalEndTime,
        ) as any;
      }
    }

    return this.prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        championship: true,
        homeTeam: true,
        awayTeam: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.match.delete({
      where: { id },
    });
  }

  async updateScore(id: string, homeScore: number, awayScore: number) {
    const match = await this.findOne(id);
    
    // Atualizar status para em_andamento se ainda estiver agendada
    let status = match.status;
    if (match.status === 'agendada') {
      status = 'em_andamento';
    }

    return this.prisma.match.update({
      where: { id },
      data: {
        homeScore,
        awayScore,
        status: status as any,
      },
      include: {
        championship: true,
        homeTeam: true,
        awayTeam: true,
      },
    });
  }
}

