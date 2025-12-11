import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SportCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sportCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}

