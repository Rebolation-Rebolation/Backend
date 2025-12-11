# 🚀 Guia Rápido de Execução e Testes

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/sports_platform?schema=public"

# JWT
JWT_SECRET=seu-secret-key-super-seguro-aqui
JWT_EXPIRES_IN=7d

# Servidor
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

**Substitua:**
- `usuario` e `senha` pelas credenciais do seu PostgreSQL
- `seu-secret-key-super-seguro-aqui` por uma chave secreta forte

### 3. Criar Banco de Dados

No PostgreSQL, execute:

```sql
CREATE DATABASE sports_platform;
```

### 4. Configurar Prisma

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar e aplicar migrations
npm run prisma:migrate
```

## ▶️ Executar o Projeto

### Modo Desenvolvimento (Recomendado)

```bash
npm run start:dev
```

O servidor estará disponível em: `http://localhost:3000`

### Modo Produção

```bash
# Compilar
npm run build

# Executar
npm run start:prod
```

## 🧪 Como Testar

### 1. Testes Automatizados

```bash
# Executar todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:cov

# Testes E2E
npm run test:e2e
```

### 2. Testar via Swagger

1. Inicie o servidor: `npm run start:dev`
2. Acesse: `http://localhost:3000/api`
3. Use a interface do Swagger para testar os endpoints

### 3. Testar via cURL

#### Registrar Usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

#### Fazer Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

#### Acessar Endpoint Protegido

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Visualizar Banco de Dados

```bash
npm run prisma:studio
```

Acesse: `http://localhost:5555`

## 🔍 Verificar se Está Funcionando

1. **Servidor rodando:**
   - Acesse `http://localhost:3000` - deve retornar uma resposta
   - Acesse `http://localhost:3000/api` - deve abrir o Swagger

2. **Banco de dados conectado:**
   - Execute `npm run prisma:studio` e verifique se consegue ver as tabelas

3. **Endpoints funcionando:**
   - Teste o endpoint `GET /sport-categories` (não requer autenticação)
   - Teste o endpoint `POST /auth/register` para criar um usuário

## 🐛 Solução de Problemas

### Erro de conexão com banco de dados

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco `sports_platform` foi criado

### Erro ao executar migrations

```bash
# Resetar o banco (CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Ou criar uma nova migration
npm run prisma:migrate
```

### Porta já em uso

Altere a porta no arquivo `.env`:
```env
PORT=3001
```

### Prisma Client não encontrado

```bash
npm run prisma:generate
```

## 📚 Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev          # Iniciar com hot-reload
npm run start:debug        # Iniciar em modo debug

# Banco de Dados
npm run prisma:generate    # Gerar Prisma Client
npm run prisma:migrate     # Criar e aplicar migration
npm run prisma:studio      # Abrir interface gráfica

# Testes
npm run test               # Executar testes
npm run test:watch         # Testes em modo watch
npm run test:cov           # Testes com cobertura

# Qualidade
npm run lint               # Verificar código
npm run format             # Formatar código
```

