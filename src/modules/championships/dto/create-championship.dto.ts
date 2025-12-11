import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChampionshipStatus, DisputeType } from '../../../types/prisma.types';

export class CreateChampionshipDto {
  @ApiProperty({ example: 'Campeonato Regional 2024' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Descrição do campeonato', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'base64image...', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'uuid-da-categoria' })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ enum: ChampionshipStatus, example: ChampionshipStatus.inscricoes_abertas, required: false })
  @IsOptional()
  @IsEnum(ChampionshipStatus)
  status?: ChampionshipStatus;

  @ApiProperty({ example: '2024-01-15' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-06-30' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsNotEmpty()
  @IsDateString()
  registrationStartDate: string;

  @ApiProperty({ example: '2024-01-10' })
  @IsNotEmpty()
  @IsDateString()
  registrationEndDate: string;

  @ApiProperty({ example: 16, minimum: 2 })
  @IsNotEmpty()
  @IsInt()
  @Min(2)
  teamLimit: number;

  @ApiProperty({ example: 'Regras do campeonato...', required: false })
  @IsOptional()
  @IsString()
  rules?: string;

  @ApiProperty({ example: 'São Paulo, SP', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ enum: DisputeType, example: DisputeType.pontos_corridos })
  @IsNotEmpty()
  @IsEnum(DisputeType)
  disputeType: DisputeType;
}

