import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto, owner: any) {
    return this.prisma.team.create({
      data: {
        ...createTeamDto,
        ownerId: owner.id,
      },
      include: {
        category: true,
      },
    });
  }

  async findAllByOwner(ownerId: string) {
    return this.prisma.team.findMany({
      where: { ownerId },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string, ownerId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        category: true,
        owner: true,
      },
    });

    if (!team) {
      throw new NotFoundException('Time não encontrado');
    }

    if (team.ownerId !== ownerId) {
      throw new ForbiddenException('Você não tem permissão para acessar este time');
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto, ownerId: string) {
    await this.findOne(id, ownerId);

    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string, ownerId: string): Promise<void> {
    await this.findOne(id, ownerId);
    await this.prisma.team.delete({
      where: { id },
    });
  }
}

