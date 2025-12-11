import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../types/prisma.types';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo time' })
  create(@Body() createTeamDto: CreateTeamDto, @CurrentUser() user: User) {
    return this.teamsService.create(createTeamDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar times do usuário' })
  findAll(@CurrentUser() user: User) {
    return this.teamsService.findAllByOwner(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes do time' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.teamsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar time' })
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @CurrentUser() user: User,
  ) {
    return this.teamsService.update(id, updateTeamDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir time' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.teamsService.remove(id, user.id);
  }
}

