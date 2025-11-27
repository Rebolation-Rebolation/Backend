// src/matches/entities/match.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// Supondo que você já tenha as entidades para Atletica, Campeonato e Placar
// Se não tiver, precisará criá-las também.
import { Atletica } from '../../atleticas/entities/atletica.entity';
import { Campeonato } from '../../campeonatos/entities/campeonato.entity';
import { Placar } from '../../placares/entities/placar.entity';

@Entity({ name: 'partida' }) // Mapeia para a tabela 'PARTIDA'
export class Match {
  @PrimaryGeneratedColumn({ name: 'id_partida' })
  id: number;

  @Column({ name: 'dt_ocorrencia', type: 'date' })
  occurrenceDate: Date;

  @Column({ name: 'mvp', length: 255, nullable: true })
  mvp: string;

  // --- Relacionamentos ---

  @ManyToOne(() => Atletica, { eager: true }) // eager: true carrega a atlética automaticamente
  @JoinColumn({ name: 'id_primeira_atletica' })
  firstTeam: Atletica;

  @ManyToOne(() => Atletica, { eager: true })
  @JoinColumn({ name: 'id_segunda_atletica' })
  secondTeam: Atletica;

  @ManyToOne(() => Campeonato, { eager: true })
  @JoinColumn({ name: 'id_campeonato' })
  championship: Campeonato;

  @ManyToOne(() => Placar, { eager: true })
  @JoinColumn({ name: 'id_placar' })
  score: Placar;
}
