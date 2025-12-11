# 🔄 Guia de Migração para Prisma

## ✅ O que foi migrado

### 1. Schema Prisma
- ✅ Criado `prisma/schema.prisma` com todas as entidades
- ✅ Enums definidos (ChampionshipStatus, DisputeType, EnrollmentStatus, MatchStatus)
- ✅ Relacionamentos configurados
- ✅ Índices e constraints

### 2. PrismaService
- ✅ Criado `src/prisma/prisma.service.ts`
- ✅ Implementa `OnModuleInit` e `OnModuleDestroy` para gerenciar conexão

### 3. Services Atualizados
- ✅ `AuthService` - Migrado para Prisma
- ✅ `TeamsService` - Migrado para Prisma
- ✅ `ChampionshipsService` - Migrado para Prisma
- ✅ `EnrollmentsService` - Migrado para Prisma
- ✅ `MatchesService` - Migrado para Prisma
- ✅ `TrophiesService` - Migrado para Prisma
- ✅ `SportCategoriesService` - Migrado para Prisma
- ✅ `UsersService` - Migrado para Prisma

### 4. Módulos Atualizados
- ✅ Todos os módulos removem `TypeOrmModule.forFeature()`
- ✅ Todos os módulos adicionam `PrismaService` como provider

### 5. Package.json
- ✅ Removido `@nestjs/typeorm` e `typeorm`
- ✅ Adicionado `@prisma/client` e `prisma`
- ✅ Scripts atualizados para Prisma

## 🚀 Como usar

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar DATABASE_URL

No arquivo `.env`, adicione ou atualize:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/sports_platform?schema=public"
```

Ou use as variáveis individuais (o Prisma usa DATABASE_URL):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=sports_platform

# Prisma usa DATABASE_URL
DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?schema=public"
```

### 3. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 4. Criar e executar migrations

```bash
# Criar migration inicial
npm run prisma:migrate

# Ou em produção
npm run prisma:migrate:deploy
```

### 5. Seed do banco (opcional)

```bash
npm run prisma:seed
```

### 6. Iniciar servidor

```bash
npm run start:dev
```

## 📝 Scripts Disponíveis

```bash
npm run prisma:generate      # Gerar Prisma Client
npm run prisma:migrate        # Criar e aplicar migration (dev)
npm run prisma:migrate:deploy # Aplicar migrations (produção)
npm run prisma:studio         # Abrir Prisma Studio (GUI)
npm run prisma:seed           # Executar seed
```

## 🔄 Diferenças Principais

### TypeORM → Prisma

**Antes (TypeORM):**
```typescript
@InjectRepository(User)
private usersRepository: Repository<User>

await this.usersRepository.findOne({ where: { id } })
```

**Depois (Prisma):**
```typescript
constructor(private prisma: PrismaService) {}

await this.prisma.user.findUnique({ where: { id } })
```

### Queries Complexas

**TypeORM:**
```typescript
const queryBuilder = this.repository
  .createQueryBuilder('entity')
  .leftJoinAndSelect('entity.relation', 'relation')
  .where('entity.field = :value', { value })
```

**Prisma:**
```typescript
await this.prisma.entity.findMany({
  where: { field: value },
  include: { relation: true }
})
```

## ⚠️ Notas Importantes

1. **Enums**: No Prisma, os enums são definidos no schema e gerados automaticamente
2. **Relacionamentos**: Use `include` para carregar relações
3. **Unique Constraints**: Prisma usa sintaxe especial para campos únicos compostos
4. **Migrations**: Prisma gerencia migrations automaticamente
5. **Type Safety**: Prisma gera tipos TypeScript automaticamente

## 🗑️ Arquivos que podem ser removidos

- `src/entities/*.entity.ts` - Não são mais necessários (Prisma gera do schema)
- `src/migrations/*.ts` - Migrations do TypeORM (Prisma cria novas)
- `src/config/database.config.ts` - Não é mais usado (mantido apenas para referência)

## 📚 Documentação

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma + NestJS](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/working-with-prismaclient-in-a-typescript-node-application)

