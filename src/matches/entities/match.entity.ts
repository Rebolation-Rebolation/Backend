// Since we're using Prisma, we import the generated types from Prisma Client
import { partida, Prisma } from '@prisma/client';

// Export Prisma types for use in the application
export type Match = Prisma.partidaGetPayload<{
  include: {
    campeonato: true;
    placar: true;
    atletica_partida_id_primeira_atleticaToatletica: true;
    atletica_partida_id_segunda_atleticaToatletica: true;
  };
}>;

// You can also export the base type without relations if needed
export type MatchBase = partida;
