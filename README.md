# 🏆 Sports Platform Backend

Backend completo em Nest.js para plataforma de gerenciamento esportivo.

## 📋 Tecnologias

- **Nest.js** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **TypeScript** - Linguagem

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL instalado e rodando
- npm ou yarn

### Passo a Passo

#### 1. Instalar dependências

```bash
npm install
```

#### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/sports_platform?schema=public"
JWT_SECRET=seu-secret-key-super-seguro-aqui
JWT_EXPIRES_IN=7d
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

**Importante:** Substitua `usuario` e `senha` pelas credenciais do seu PostgreSQL.

#### 3. Criar o banco de dados

No PostgreSQL, crie o banco de dados:

```sql
CREATE DATABASE sports_platform;
```

#### 4. Gerar Prisma Client

```bash
npm run prisma:generate
```

#### 5. Executar migrations

```bash
npm run prisma:migrate
```

Este comando irá:
- Criar as tabelas no banco de dados
- Aplicar todas as migrations necessárias

#### 6. (Opcional) Popular o banco com dados iniciais

Se houver um arquivo de seed:

```bash
npm run prisma:seed
```

#### 7. Iniciar o servidor

**Desenvolvimento (com hot-reload):**
```bash
npm run start:dev
```

**Produção:**
```bash
npm run build
npm run start:prod
```

O servidor estará rodando em `http://localhost:3000`

#### 8. Acessar a documentação Swagger

Após iniciar o servidor, acesse:
```
http://localhost:3000/api
```

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma        # Schema do Prisma (modelos de dados)
│   └── prisma.config.ts     # Configuração do Prisma
├── src/
│   ├── config/              # Configurações
│   │   └── database.config.ts
│   ├── prisma/              # Serviço Prisma
│   │   └── prisma.service.ts
│   ├── modules/             # Módulos da aplicação
│   │   ├── auth/           # Autenticação
│   │   ├── users/          # Usuários
│   │   ├── teams/          # Times
│   │   ├── championships/  # Campeonatos
│   │   ├── enrollments/    # Inscrições
│   │   ├── matches/        # Partidas
│   │   ├── trophies/       # Troféus
│   │   └── sport-categories/ # Categorias
│   ├── types/               # Tipos TypeScript
│   │   └── prisma.types.ts
│   ├── main.ts             # Arquivo principal
│   └── app.module.ts       # Módulo raiz
├── package.json
└── tsconfig.json
```

## 🔌 Endpoints da API

### Autenticação
- `POST /auth/register` - Cadastrar usuário
- `POST /auth/login` - Fazer login
- `POST /auth/forgot-password` - Solicitar recuperação
- `POST /auth/reset-password` - Redefinir senha
- `GET /auth/me` - Dados do usuário logado

### Times
- `GET /teams` - Listar times do usuário
- `GET /teams/:id` - Detalhes do time
- `POST /teams` - Criar time
- `PATCH /teams/:id` - Atualizar time
- `DELETE /teams/:id` - Excluir time

### Campeonatos
- `GET /championships` - Listar (com filtros e paginação)
- `GET /championships/available` - Campeonatos disponíveis
- `GET /championships/:id` - Detalhes
- `POST /championships` - Criar
- `PATCH /championships/:id` - Atualizar
- `DELETE /championships/:id` - Excluir
- `GET /championships/:id/teams` - Times inscritos

### Inscrições
- `POST /championships/:id/enroll/:teamId` - Inscrever time
- `DELETE /championships/:id/enroll/:teamId` - Cancelar inscrição

### Partidas
- `GET /matches` - Listar partidas
- `GET /matches/:id` - Detalhes
- `POST /matches/:id/score` - Atualizar placar

### Categorias
- `GET /sport-categories` - Listar todas

### Troféus
- `GET /trophies` - Listar (filtrado por time ou campeonato)

## 📚 Documentação Swagger

Após iniciar o servidor, acesse:
```
http://localhost:3000/api
```

## 🗄️ Modelo de Dados

Ver arquivo `BACKEND_ANALYSIS.md` para diagrama ER completo.

## 🔐 Autenticação

A maioria dos endpoints requer autenticação JWT. Adicione o header:
```
Authorization: Bearer <token>
```

## 📝 Scripts Disponíveis

### Desenvolvimento
```bash
npm run start          # Iniciar servidor (produção)
npm run start:dev      # Iniciar em modo desenvolvimento (com hot-reload)
npm run start:debug    # Iniciar em modo debug
npm run build          # Compilar TypeScript para JavaScript
```

### Prisma (Banco de Dados)
```bash
npm run prisma:generate      # Gerar Prisma Client
npm run prisma:migrate        # Criar e aplicar migration (desenvolvimento)
npm run prisma:migrate:deploy # Aplicar migrations (produção)
npm run prisma:studio         # Abrir Prisma Studio (interface gráfica)
npm run prisma:seed           # Executar seed do banco de dados
```

### Testes
```bash
npm run test           # Executar todos os testes
npm run test:watch     # Executar testes em modo watch
npm run test:cov       # Executar testes com cobertura
npm run test:debug     # Executar testes em modo debug
npm run test:e2e       # Executar testes end-to-end
```

### Qualidade de Código
```bash
npm run lint           # Executar ESLint e corrigir problemas
npm run format         # Formatar código com Prettier
```

## 🧪 Como Testar o Projeto

### 1. Testes Unitários e de Integração

Execute os testes:

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:cov
```

### 2. Testes End-to-End (E2E)

```bash
npm run test:e2e
```

### 3. Testar a API Manualmente

#### Usando Swagger UI

1. Inicie o servidor: `npm run start:dev`
2. Acesse `http://localhost:3000/api`
3. Use a interface do Swagger para testar os endpoints

#### Usando cURL ou Postman

**Exemplo: Criar um usuário**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Exemplo: Fazer login**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Exemplo: Acessar endpoint protegido (com token JWT)**

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Testar com Prisma Studio

Visualize e edite dados diretamente no banco:

```bash
npm run prisma:studio
```

Isso abrirá uma interface web em `http://localhost:5555`

### 5. Verificar Logs

O servidor em modo desenvolvimento mostra logs no console. Para produção, configure um sistema de logging adequado.

## 📦 Variáveis de Ambiente

Todas as variáveis de ambiente necessárias estão documentadas no arquivo `.env.example`. 

### Variáveis Obrigatórias

- `DATABASE_URL` - URL de conexão com o PostgreSQL
- `JWT_SECRET` - Chave secreta para assinar tokens JWT (use uma chave forte em produção)

### Variáveis Opcionais

- `PORT` - Porta do servidor (padrão: 3000)
- `JWT_EXPIRES_IN` - Tempo de expiração do token (padrão: 7d)
- `CORS_ORIGIN` - Origem permitida para CORS (padrão: http://localhost:5173)

**⚠️ Importante:** Nunca commite o arquivo `.env` no repositório. Use `.env.example` como template.

## 🔄 Integração com Frontend

Ver arquivo `INTEGRATION_GUIDE.md` para guia completo de integração.

