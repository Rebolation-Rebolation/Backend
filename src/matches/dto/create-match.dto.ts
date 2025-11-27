// src/matches/dto/create-match.dto.ts
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMatchDto {
  @IsInt()
  @IsNotEmpty()
  primeiraAtleticaId: number;

  @IsInt()
  @IsNotEmpty()
  segundaAtleticaId: number;

  @IsInt()
  @IsNotEmpty()
  campeonatoId: number;

  @IsDateString()
  @IsNotEmpty()
  ocorrencia: string; // Recebemos como string (ex: "2023-10-27T10:00:00.000Z")

  @IsString()
  @IsOptional()
  mvp?: string;
}
