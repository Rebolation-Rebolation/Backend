// Este arquivo não é mais necessário com Prisma
// Mantido apenas para referência ou uso futuro se necessário

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  getDatabaseUrl(): string {
    const host = this.configService.get('DB_HOST', 'localhost');
    const port = this.configService.get('DB_PORT', 5432);
    const username = this.configService.get('DB_USERNAME', 'postgres');
    const password = this.configService.get('DB_PASSWORD', 'postgres');
    const database = this.configService.get('DB_DATABASE', 'sports_platform');

    return `postgresql://${username}:${password}@${host}:${port}/${database}?schema=public`;
  }
}
