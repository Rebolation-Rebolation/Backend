import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateChampionshipDto } from './dto/create-championship.dto';
import { UpdateChampionshipDto } from './dto/update-championship.dto';
import { FilterChampionshipDto } from './dto/filter-championship.dto';
import { ChampionshipStatus } from '../../types/prisma.types';

@Injectable()
export class ChampionshipsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calcula o status do campeonato baseado nas datas
   */
  private calculateStatus(
    registrationStartDate: Date,
    registrationEndDate: Date,
    startDate: Date,
    endDate: Date,
  ): ChampionshipStatus {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalizar para comparar apenas datas

    const regStart = new Date(registrationStartDate);
    regStart.setHours(0, 0, 0, 0);
    const regEnd = new Date(registrationEndDate);
    regEnd.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    // Inscrições abertas: hoje está entre início e fim das inscrições
    if (now >= regStart && now <= regEnd) {
      return 'inscricoes_abertas';
    }

    // Aguardando início ou Inscrições encerradas: período de inscrições passou mas campeonato não começou
    if (now > regEnd && now < start) {
      // Se ainda não chegou na data de início, está aguardando
      return 'aguardando_inicio';
    }

    // Ativo: campeonato está em andamento
    if (now >= start && now <= end) {
      return 'ativo';
    }

    // Finalizado: campeonato terminou
    if (now > end) {
      return 'finalizado';
    }

    // Default: inscrições ainda não abriram
    return 'inscricoes_abertas';
  }

  async create(createChampionshipDto: CreateChampionshipDto) {
    const startDate = new Date(createChampionshipDto.startDate);
    const endDate = new Date(createChampionshipDto.endDate);
    const registrationStartDate = new Date(createChampionshipDto.registrationStartDate);
    const registrationEndDate = new Date(createChampionshipDto.registrationEndDate);

    // Calcular status automaticamente se não fornecido
    const calculatedStatus = createChampionshipDto.status || 
      this.calculateStatus(registrationStartDate, registrationEndDate, startDate, endDate);

    const championship = await this.prisma.championship.create({
      data: {
        ...createChampionshipDto,
        startDate,
        endDate,
        registrationStartDate,
        registrationEndDate,
        status: calculatedStatus as any,
      },
      include: {
        category: true,
      },
    });

    return championship;
  }

  async findAll(filters: FilterChampionshipDto) {
    const { search, categoryId, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ChampionshipWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.championship.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.championship.count({ where }),
    ]);

    return {
      data: data.map((champ) => {
        // Recalcular status baseado em datas atuais
        const calculatedStatus = this.calculateStatus(
          champ.registrationStartDate,
          champ.registrationEndDate,
          champ.startDate,
          champ.endDate,
        );

        // Atualizar status no banco se diferente
        if (champ.status !== calculatedStatus) {
          // Atualizar assincronamente (não bloquear resposta)
          this.prisma.championship.update({
            where: { id: champ.id },
            data: { status: calculatedStatus as any },
          }).catch(() => {
            // Ignorar erros de atualização assíncrona
          });
        }

        return {
          ...champ,
          status: calculatedStatus, // Retornar status calculado
          enrolledTeams: champ._count.enrollments,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const championship = await this.prisma.championship.findUnique({
      where: { id },
      include: {
        category: true,
        enrollments: {
          include: {
            team: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!championship) {
      throw new NotFoundException('Campeonato não encontrado');
    }

    // Recalcular e atualizar status se necessário
    const calculatedStatus = this.calculateStatus(
      championship.registrationStartDate,
      championship.registrationEndDate,
      championship.startDate,
      championship.endDate,
    );

    if (championship.status !== calculatedStatus) {
      await this.prisma.championship.update({
        where: { id },
        data: { status: calculatedStatus as any },
      });
      championship.status = calculatedStatus;
    }

    return championship;
  }

  async update(id: string, updateChampionshipDto: UpdateChampionshipDto) {
    const existing = await this.findOne(id);

    const updateData: any = { ...updateChampionshipDto };

    // Preparar datas para cálculo de status
    let startDate = existing.startDate;
    let endDate = existing.endDate;
    let registrationStartDate = existing.registrationStartDate;
    let registrationEndDate = existing.registrationEndDate;

    if (updateChampionshipDto.startDate) {
      startDate = new Date(updateChampionshipDto.startDate);
      updateData.startDate = startDate;
    }
    if (updateChampionshipDto.endDate) {
      endDate = new Date(updateChampionshipDto.endDate);
      updateData.endDate = endDate;
    }
    if (updateChampionshipDto.registrationStartDate) {
      registrationStartDate = new Date(updateChampionshipDto.registrationStartDate);
      updateData.registrationStartDate = registrationStartDate;
    }
    if (updateChampionshipDto.registrationEndDate) {
      registrationEndDate = new Date(updateChampionshipDto.registrationEndDate);
      updateData.registrationEndDate = registrationEndDate;
    }

    // Recalcular status se datas foram alteradas ou status não foi fornecido
    if (!updateChampionshipDto.status || 
        updateChampionshipDto.startDate || 
        updateChampionshipDto.endDate || 
        updateChampionshipDto.registrationStartDate || 
        updateChampionshipDto.registrationEndDate) {
      updateData.status = this.calculateStatus(
        registrationStartDate,
        registrationEndDate,
        startDate,
        endDate,
      ) as any;
    }

    return this.prisma.championship.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.championship.delete({
      where: { id },
    });
  }

  async findAvailable() {
    const championships = await this.prisma.championship.findMany({
      include: {
        category: true,
      },
    });

    // Filtrar apenas campeonatos com inscrições abertas (baseado em cálculo)
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return championships.filter((champ) => {
      const regStart = new Date(champ.registrationStartDate);
      regStart.setHours(0, 0, 0, 0);
      const regEnd = new Date(champ.registrationEndDate);
      regEnd.setHours(0, 0, 0, 0);

      return now >= regStart && now <= regEnd;
    });
  }
}

