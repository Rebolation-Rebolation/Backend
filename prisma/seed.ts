import { PrismaClient, EnrollmentStatus, MatchStatus, ChampionshipStatus, DisputeType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional - comente se não quiser limpar)
  console.log('🧹 Limpando dados existentes...');
  await prisma.trophy.deleteMany();
  await prisma.match.deleteMany();
  await prisma.championshipEnrollment.deleteMany();
  await prisma.championship.deleteMany();
  await prisma.team.deleteMany();
  await prisma.sportCategory.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log('👥 Criando usuários...');
  const passwordHash = await bcrypt.hash('123456', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@example.com',
      password: passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      password: passwordHash,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Pedro Oliveira',
      email: 'pedro@example.com',
      password: passwordHash,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'Ana Costa',
      email: 'ana@example.com',
      password: passwordHash,
    },
  });

  console.log(`✅ Criados ${4} usuários`);

  // Criar categorias esportivas
  console.log('🏆 Criando categorias esportivas...');
  const futebol = await prisma.sportCategory.create({
    data: {
      name: 'Futebol',
      icon: '⚽',
    },
  });

  const basquete = await prisma.sportCategory.create({
    data: {
      name: 'Basquete',
      icon: '🏀',
    },
  });

  const volei = await prisma.sportCategory.create({
    data: {
      name: 'Vôlei',
      icon: '🏐',
    },
  });

  console.log(`✅ Criadas ${3} categorias esportivas`);

  // Criar times
  console.log('👕 Criando times...');
  const times = [
    {
      name: 'Flamengo FC',
      description: 'Time de futebol do Flamengo',
      categoryId: futebol.id,
      ownerId: user1.id,
    },
    {
      name: 'Palmeiras United',
      description: 'Time de futebol do Palmeiras',
      categoryId: futebol.id,
      ownerId: user2.id,
    },
    {
      name: 'São Paulo Stars',
      description: 'Time de futebol do São Paulo',
      categoryId: futebol.id,
      ownerId: user3.id,
    },
    {
      name: 'Lakers Brasil',
      description: 'Time de basquete inspirado nos Lakers',
      categoryId: basquete.id,
      ownerId: user1.id,
    },
    {
      name: 'Bulls SP',
      description: 'Time de basquete inspirado nos Bulls',
      categoryId: basquete.id,
      ownerId: user2.id,
    },
    {
      name: 'Vôlei Masters',
      description: 'Time profissional de vôlei',
      categoryId: volei.id,
      ownerId: user4.id,
    },
  ];

  const createdTeams = [];
  for (const time of times) {
    const team = await prisma.team.create({ data: time });
    createdTeams.push(team);
  }

  console.log(`✅ Criados ${createdTeams.length} times`);

  // Criar campeonatos
  console.log('🏅 Criando campeonatos...');
  const hoje = new Date();
  const proximaSemana = new Date(hoje);
  proximaSemana.setDate(hoje.getDate() + 7);
  const proximoMes = new Date(hoje);
  proximoMes.setMonth(hoje.getMonth() + 1);
  const proximosDoisMeses = new Date(hoje);
  proximosDoisMeses.setMonth(hoje.getMonth() + 2);

  const campeonato1 = await prisma.championship.create({
    data: {
      name: 'Campeonato Brasileiro de Futebol 2024',
      description: 'Campeonato nacional de futebol com os melhores times do país',
      categoryId: futebol.id,
      status: ChampionshipStatus.inscricoes_abertas,
      startDate: proximaSemana,
      endDate: proximosDoisMeses,
      registrationStartDate: hoje,
      registrationEndDate: proximaSemana,
      teamLimit: 16,
      rules: 'Regras padrão da FIFA. Cada time joga contra todos os outros em turno único.',
      location: 'Estádios diversos pelo Brasil',
      disputeType: DisputeType.pontos_corridos,
    },
  });

  const campeonato2 = await prisma.championship.create({
    data: {
      name: 'Liga de Basquete 2024',
      description: 'Liga profissional de basquete',
      categoryId: basquete.id,
      status: ChampionshipStatus.ativo,
      startDate: hoje,
      endDate: proximoMes,
      registrationStartDate: new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000),
      registrationEndDate: hoje,
      teamLimit: 8,
      rules: 'Regras da FIBA. Sistema de grupos seguido de mata-mata.',
      location: 'Ginásios da cidade',
      disputeType: DisputeType.mista,
    },
  });

  const campeonato3 = await prisma.championship.create({
    data: {
      name: 'Copa de Vôlei 2024',
      description: 'Torneio de vôlei com formato mata-mata',
      categoryId: volei.id,
      status: ChampionshipStatus.inscricoes_abertas,
      startDate: proximoMes,
      endDate: proximosDoisMeses,
      registrationStartDate: hoje,
      registrationEndDate: proximaSemana,
      teamLimit: 12,
      rules: 'Regras da FIVB. Formato mata-mata direto.',
      location: 'Arena de Vôlei',
      disputeType: DisputeType.mata_mata,
    },
  });

  console.log(`✅ Criados ${3} campeonatos`);

  // Criar inscrições
  console.log('📝 Criando inscrições...');
  const inscricoes = [
    {
      championshipId: campeonato1.id,
      teamId: createdTeams[0].id, // Flamengo FC
      status: EnrollmentStatus.confirmado,
    },
    {
      championshipId: campeonato1.id,
      teamId: createdTeams[1].id, // Palmeiras United
      status: EnrollmentStatus.confirmado,
    },
    {
      championshipId: campeonato1.id,
      teamId: createdTeams[2].id, // São Paulo Stars
      status: EnrollmentStatus.pendente,
    },
    {
      championshipId: campeonato2.id,
      teamId: createdTeams[3].id, // Lakers Brasil
      status: EnrollmentStatus.confirmado,
    },
    {
      championshipId: campeonato2.id,
      teamId: createdTeams[4].id, // Bulls SP
      status: EnrollmentStatus.confirmado,
    },
    {
      championshipId: campeonato3.id,
      teamId: createdTeams[5].id, // Vôlei Masters
      status: EnrollmentStatus.confirmado,
    },
  ];

  for (const inscricao of inscricoes) {
    await prisma.championshipEnrollment.create({ data: inscricao });
  }

  console.log(`✅ Criadas ${inscricoes.length} inscrições`);

  // Criar partidas
  console.log('⚽ Criando partidas...');
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);
  const depoisAmanha = new Date(hoje);
  depoisAmanha.setDate(hoje.getDate() + 2);

  const partidas = [
    {
      championshipId: campeonato1.id,
      homeTeamId: createdTeams[0].id, // Flamengo FC
      awayTeamId: createdTeams[1].id, // Palmeiras United
      type: 'Rodada 1',
      title: 'Flamengo FC vs Palmeiras United',
      date: amanha,
      startTime: new Date('1970-01-01T15:00:00'),
      endTime: new Date('1970-01-01T17:00:00'),
      local: 'Maracanã',
      homeScore: 0,
      awayScore: 0,
      status: MatchStatus.agendada,
    },
    {
      championshipId: campeonato1.id,
      homeTeamId: createdTeams[1].id, // Palmeiras United
      awayTeamId: createdTeams[2].id, // São Paulo Stars
      type: 'Rodada 1',
      title: 'Palmeiras United vs São Paulo Stars',
      date: depoisAmanha,
      startTime: new Date('1970-01-01T16:00:00'),
      endTime: new Date('1970-01-01T18:00:00'),
      local: 'Allianz Parque',
      homeScore: 0,
      awayScore: 0,
      status: MatchStatus.agendada,
    },
    {
      championshipId: campeonato2.id,
      homeTeamId: createdTeams[3].id, // Lakers Brasil
      awayTeamId: createdTeams[4].id, // Bulls SP
      type: 'Fase de Grupos',
      title: 'Lakers Brasil vs Bulls SP',
      date: hoje,
      startTime: new Date('1970-01-01T19:00:00'),
      endTime: new Date('1970-01-01T21:00:00'),
      local: 'Ginásio Municipal',
      homeScore: 85,
      awayScore: 78,
      status: MatchStatus.finalizada,
    },
  ];

  for (const partida of partidas) {
    await prisma.match.create({ data: partida });
  }

  console.log(`✅ Criadas ${partidas.length} partidas`);

  // Criar troféus (para campeonatos finalizados)
  console.log('🏆 Criando troféus...');
  const trofeus = [
    {
      championshipId: campeonato2.id,
      teamId: createdTeams[3].id, // Lakers Brasil
      position: 1,
      year: 2024,
      wins: 5,
      losses: 1,
      draws: 0,
    },
    {
      championshipId: campeonato2.id,
      teamId: createdTeams[4].id, // Bulls SP
      position: 2,
      year: 2024,
      wins: 4,
      losses: 2,
      draws: 0,
    },
  ];

  for (const trofeu of trofeus) {
    await prisma.trophy.create({ data: trofeu });
  }

  console.log(`✅ Criados ${trofeus.length} troféus`);

  console.log('✨ Seed concluído com sucesso!');
  console.log('\n📋 Resumo:');
  console.log(`   - ${4} usuários criados`);
  console.log(`   - ${3} categorias esportivas criadas`);
  console.log(`   - ${createdTeams.length} times criados`);
  console.log(`   - ${3} campeonatos criados`);
  console.log(`   - ${inscricoes.length} inscrições criadas`);
  console.log(`   - ${partidas.length} partidas criadas`);
  console.log(`   - ${trofeus.length} troféus criados`);
  console.log('\n🔑 Credenciais de teste:');
  console.log('   Email: joao@example.com | Senha: 123456');
  console.log('   Email: maria@example.com | Senha: 123456');
  console.log('   Email: pedro@example.com | Senha: 123456');
  console.log('   Email: ana@example.com | Senha: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

