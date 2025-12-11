import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TrophiesService } from './trophies.service';

@ApiTags('Trophies')
@Controller('trophies')
export class TrophiesController {
  constructor(private readonly trophiesService: TrophiesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar troféus' })
  findAll(@Query('teamId') teamId?: string, @Query('championshipId') championshipId?: string) {
    return this.trophiesService.findAll(teamId, championshipId);
  }
}

