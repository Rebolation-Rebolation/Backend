import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchStatus } from '../../../types/prisma.types';

export class CreateMatchDto {
  @ApiProperty({ example: 'uuid-do-campeonato' })
  @IsNotEmpty()
  @IsUUID()
  championshipId: string;

  @ApiProperty({ example: 'uuid-time-casa' })
  @IsNotEmpty()
  @IsUUID()
  homeTeamId: string;

  @ApiProperty({ example: 'uuid-time-visitante' })
  @IsNotEmpty()
  @IsUUID()
  awayTeamId: string;

  @ApiProperty({ example: 'Futebol' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: 'Partida 1' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: '14:00' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ example: '16:00', required: false })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ example: 'Arena Fonte Nova' })
  @IsNotEmpty()
  @IsString()
  local: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  homeScore?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  awayScore?: number;

  @ApiProperty({ enum: MatchStatus, example: MatchStatus.agendada, required: false })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;
}

