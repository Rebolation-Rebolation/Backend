import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'Time do João' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'base64image...', required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ example: 'Descrição do time', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'uuid-da-categoria' })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}

