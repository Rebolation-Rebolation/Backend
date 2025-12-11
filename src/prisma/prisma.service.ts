import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    this.prisma = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // Expose PrismaClient methods
  get atletica() {
    return this.prisma.atletica;
  }

  get campeonato() {
    return this.prisma.campeonato;
  }

  get classificacao_campeonato() {
    return this.prisma.classificacao_campeonato;
  }

  get instituicao() {
    return this.prisma.instituicao;
  }

  get modalidade() {
    return this.prisma.modalidade;
  }

  get partida() {
    return this.prisma.partida;
  }

  get placar() {
    return this.prisma.placar;
  }

  // Expose transaction methods
  get $transaction() {
    return this.prisma.$transaction.bind(this.prisma);
  }

  get $connect() {
    return this.prisma.$connect.bind(this.prisma);
  }

  get $disconnect() {
    return this.prisma.$disconnect.bind(this.prisma);
  }
}
