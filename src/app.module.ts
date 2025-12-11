import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ChampionshipsModule } from './modules/championships/championships.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { MatchesModule } from './modules/matches/matches.module';
import { TrophiesModule } from './modules/trophies/trophies.module';
import { SportCategoriesModule } from './modules/sport-categories/sport-categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    TeamsModule,
    ChampionshipsModule,
    EnrollmentsModule,
    MatchesModule,
    TrophiesModule,
    SportCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

