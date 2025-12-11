import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChampionshipsService } from './championships.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';
import { UpdateChampionshipDto } from './dto/update-championship.dto';
import { FilterChampionshipDto } from './dto/filter-championship.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Championships')
@Controller('championships')
export class ChampionshipsController {
  constructor(private readonly championshipsService: ChampionshipsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo campeonato' })
  create(@Body() createChampionshipDto: CreateChampionshipDto) {
    return this.championshipsService.create(createChampionshipDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar campeonatos (com filtros e paginação)' })
  findAll(@Query() filters: FilterChampionshipDto) {
    return this.championshipsService.findAll(filters);
  }

  @Get('available')
  @ApiOperation({ summary: 'Listar campeonatos disponíveis para inscrição' })
  findAvailable() {
    return this.championshipsService.findAvailable();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes do campeonato' })
  findOne(@Param('id') id: string) {
    return this.championshipsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar campeonato' })
  update(@Param('id') id: string, @Body() updateChampionshipDto: UpdateChampionshipDto) {
    return this.championshipsService.update(id, updateChampionshipDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir campeonato' })
  remove(@Param('id') id: string) {
    return this.championshipsService.remove(id);
  }
}

