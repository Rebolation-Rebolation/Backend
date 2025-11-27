import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  create(createMatchDto: CreateMatchDto) {
    return 'This action adds a new match';
  }

  async findAll() {
    const matches = await this.prisma.partida.findMany({
      include: {
        campeonato: true,
        placar: true,
        atletica_partida_id_primeira_atleticaToatletica: true,
        atletica_partida_id_segunda_atleticaToatletica: true,
      },
    });

    return matches;
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
