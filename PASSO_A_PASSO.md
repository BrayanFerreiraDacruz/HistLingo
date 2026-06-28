# HistLingo - Passo a Passo do Projeto

Este guia detalha os passos necessários para configurar, migrar o banco de dados e executar o projeto HistLingo (Backend e Frontend).

---

## 1. Pré-requisitos
Certifique-se de ter instalado:
- **Node.js** (v18 ou superior)
- **Docker e Docker Compose**
- **npm** ou **yarn**

---

## 2. Configuração do Banco de Dados (Docker)
O projeto utiliza PostgreSQL via Docker.

1. Suba os containers do banco de dados:
   ```bash
   docker-compose up -d db
   ```
   *Isso iniciará o container `histlingo-db` na porta 5432.*

---

## 3. Configuração do Backend (NestJS)
O backend gerencia a lógica de negócio, gamificação (XP, níveis) e o sistema de repetição espaçada (SRS).

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o arquivo `.env` (se não existir, crie um baseado no `docker-compose.yml`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/histlingo?schema=public"
   ```

3. Sincronize o banco de dados com o Prisma:
   ```bash
   # Gera o cliente Prisma
   npx prisma generate

   # Cria as tabelas no banco de dados
   npx prisma migrate dev --name init
   ```

4. Execute o backend:
   ```bash
   npm run start:dev
   ```

---

## 4. Estrutura do Banco de Dados
O banco de dados foi atualizado para suportar:
- **Usuários:** Login, XP, Nível, Streak e Papéis (Admin/Student).
- **Conteúdo:** Módulos e Lições.
- **Desafios (Perguntas):** Diferentes tipos de questões históricas.
- **Respostas:** Histórico de tentativas do usuário.
- **Desempenho:** Consolidação de pontos e acertos.
- **SRS (UserReview):** Agendamento inteligente de revisões.

---

## 5. Configuração do Frontend (HistLingo Web)
Localizado na pasta `histlingo-web/`.

1. Navegue até a pasta:
   ```bash
   cd histlingo-web
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o frontend (Vite):
   ```bash
   npm run dev
   ```

---

## 6. Comandos Úteis
- **Visualizar Banco de Dados:** `npx prisma studio`
- **Rodar Testes:** `npm run test`
- **Linting:** `npm run lint`

---

## 7. Próximos Passos Sugeridos
1. Popular o banco com lições iniciais sobre história.
2. Implementar a lógica de cálculo de XP no `GamificationService`.
3. Integrar o frontend com as novas rotas de `Answer` e `Performance`.
