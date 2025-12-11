import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SportCategoriesService } from './sport-categories.service';

@ApiTags('Sport Categories')
@Controller('sport-categories')
export class SportCategoriesController {
  constructor(private readonly sportCategoriesService: SportCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias esportivas' })
  findAll() {
    return this.sportCategoriesService.findAll();
  }
}

