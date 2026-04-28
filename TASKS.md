# Mazers — Tarefas de Desenvolvimento (TASKS)

> **Versão:** 1.0  
> **Data:** 2026-04-28  
> **Status:** Planejamento

---

## Legenda

- `[ ]` — Pendente
- `[/]` — Em progresso
- `[x]` — Concluído
- `[!]` — Bloqueado / Requer decisão
- **P0** = Essencial MVP | **P1** = Importante | **P2** = Desejável

---

## Fase 1: Setup & Scaffolding

**Agentes**: Architect

### 1.1 Backend — Inicialização do Projeto NestJS

- [x] Criar projeto NestJS (`npx -y @nestjs/cli new mazers-api`)
- [x] Configurar `tsconfig.json` (strict mode)
- [x] Configurar `.gitignore` (.env, node_modules, dist/)
- [x] Inicializar repositório Git
- [x] Criar estrutura de branch (`main` → `develop`)
- [x] Criar README.md com instruções de setup
- [x] Configurar ESLint + Prettier
- [ ] Rodar `npm audit` — garantir zero vulnerabilidades altas/críticas

### 1.2 Backend — Configuração do Banco de Dados

- [x] Instalar e configurar Prisma ORM (`npm install prisma @prisma/client`)
- [x] Criar `docker-compose.yml` (PostgreSQL para dev)
- [x] Configurar conexão com PostgreSQL (`.env`)
- [x] Criar schema Prisma com tabela `mazes`
  - [x] Campos: id, alias, rows, cols, tile_size, entrances, exits, grid (Json), created_at, updated_at
- [x] Gerar primeira migration (`npx prisma migrate dev`)
- [x] Validar que schema aplica corretamente

### 1.3 Frontend — Inicialização do Projeto HTML/CSS/JS

- [x] Criar diretório `mazers-panel/`
- [x] Criar `index.html` com estrutura base (meta tags, favicon, Google Fonts)
- [x] Criar estrutura de diretórios: `css/`, `js/`, `assets/`
- [x] Criar `css/reset.css` (CSS reset)
- [x] Criar `css/variables.css` (design tokens: cores, fontes, espaçamentos)
- [x] Criar `css/layout.css` (layout geral do painel)
- [x] Criar `css/components.css` (botões, inputs, cards)
- [x] Criar `js/app.js` (entry point com `type="module"`)
- [x] Configurar dev server (`npx -y live-server` ou `npx -y http-server`)
- [x] Inicializar repositório Git
- [x] Criar README.md com instruções de setup

---

## Fase 2: API — CRUD de Labirintos (P0)

**Agentes**: API/Backend, Architect

### 2.1 Backend — Mazes Module

- [x] Criar módulo `mazes/` (module, controller, service)
- [x] Implementar DTOs com class-validator
  - [x] `create-maze.dto.ts` (alias, rows, cols, tileSize, entrances, exits, grid)
  - [x] `update-maze.dto.ts` (partial de create)
- [x] Implementar `mazes.service.ts`
  - [x] `findAll(page, limit, search)` — listagem paginada (sem grid no retorno)
  - [x] `findOne(id)` — retorna labirinto completo (com grid)
  - [x] `create(dto)` — cria novo labirinto
  - [x] `update(id, dto)` — atualiza labirinto existente
  - [x] `remove(id)` — remove labirinto
- [x] Implementar `mazes.controller.ts`
  - [x] `GET /mazes` (listagem paginada + busca por alias)
  - [x] `GET /mazes/:id`
  - [x] `POST /mazes`
  - [x] `PATCH /mazes/:id`
  - [x] `DELETE /mazes/:id`
- [x] Implementar validação do grid
  - [x] Dimensões do grid devem corresponder a rows × cols
  - [x] Quantidade de entradas/saídas no grid deve corresponder aos parâmetros
  - [x] Entradas/saídas devem estar na borda do grid
  - [x] Tipos válidos: wall, path
  - [x] Terrenos válidos: stone, sand
  - [x] Roles válidos: entrance, exit, null
- [x] Configurar CORS no `main.ts`
- [x] Configurar rate limiting (`@nestjs/throttler`)
- [x] Configurar global validation pipe
- [ ] Testes unitários do service
- [ ] Testes E2E dos endpoints

### 2.2 Backend — Prisma Service

- [x] Criar módulo `prisma/` (module, service)
- [x] Implementar `prisma.service.ts` (extends PrismaClient, onModuleInit)
- [x] Registrar como módulo global

---

## Fase 3: API — Auto-Geração de Labirintos (P0)

**Agentes**: API/Backend, Architect

### 3.1 Backend — Generator Module

- [x] Criar módulo `generator/` (module, controller, service)
- [x] Implementar interface `MazeAlgorithm`
  ```typescript
  interface MazeAlgorithm {
    generate(rows: number, cols: number, entrances: number, exits: number): MazeCell[][];
  }
  ```
- [x] Implementar `algorithms/recursive-backtracking.ts`
  - [x] Inicializar grid com todas as células como parede
  - [x] Implementar DFS com backtracking
  - [x] Cavar caminhos (marcar como path) durante travessia
  - [x] Posicionar entradas na borda esquerda/superior
  - [x] Posicionar saídas na borda direita/inferior
  - [x] Garantir adjacência entre entrada/saída e caminho interno
  - [x] Definir terreno aleatório (stone/sand) para cada célula de caminho
- [x] Implementar `generator.service.ts`
  - [x] `generate(rows, cols, entrances, exits)` — orquestra a geração
  - [x] Validação: parâmetros válidos, entradas/saídas cabem na borda
- [x] Implementar `generator.controller.ts`
  - [x] `POST /generator/generate`
- [x] Implementar DTOs de geração (generate-maze.dto.ts)
- [ ] Testes unitários do algoritmo
  - [ ] Grid gerado tem dimensões corretas
  - [ ] Grid tem quantidade correta de entradas e saídas
  - [ ] Entradas e saídas estão na borda
  - [ ] Labirinto é solvável (pelo menos um caminho entre entrada e saída)
  - [ ] Não há ilhas (áreas desconectadas)
- [ ] Testes E2E do endpoint

---

## Fase 4: Frontend — Grid & Editor (P0)

**Agentes**: UI/UX, Frontend Integration

### 4.1 CSS — Estilos do Grid e Editor

- [ ] Criar `css/grid.css` (estilos do grid: cells, cores por tipo/terreno/role)
- [ ] Criar `css/controls.css` (painel de configuração abaixo do grid)
- [ ] Implementar cores distintas para cada estado de célula
  - [ ] Parede: `#2c3e50` (dark stone gray)
  - [x] Caminho: `#ecf0f1` (light)
  - [x] Entrada: `#2ecc71` (green)
  - [x] Saída: `#e74c3c` (red)
  - [x] Pedra (terreno): `#7f8c8d` (stone gray)
  - [x] Areia (terreno): `#f39c12` (sandy/amber)
- [x] Implementar hover state nas células
- [x] Implementar transições CSS para mudança de estado
- [x] Implementar toolbar de ferramentas do editor

### 4.2 JS — Renderização do Grid

- [x] Implementar `js/grid.js`
  - [x] Função `renderGrid(rows, cols, tileSize)` — cria elementos DOM do grid
  - [x] Função `updateCell(row, col, cellData)` — atualiza visual de uma célula
  - [x] Função `clearGrid()` — remove grid atual
  - [x] Função `getGridData()` — retorna estado atual do grid como array 2D
  - [x] Função `loadGrid(gridData)` — carrega grid a partir de dados existentes
- [x] Grid deve ser responsivo (scroll horizontal se ultrapassar viewport)
- [x] Cada célula deve exibir indicador visual do tipo, terreno e role

### 4.3 JS — Editor (Ferramentas)

- [x] Implementar `js/editor.js`
  - [x] Ferramenta: **Parede/Caminho** — click alterna entre wall e path
  - [x] Ferramenta: **Terreno** — click define pedra ou areia (dropdown/toggle)
  - [x] Ferramenta: **Entrada** — click marca célula como entrada (validar borda e quantidade)
  - [x] Ferramenta: **Saída** — click marca célula como saída (validar borda e quantidade)
  - [x] Ferramenta ativa deve ter indicação visual (botão highlighted)
  - [x] Validação: entrada/saída só em bordas
  - [x] Validação: não exceder quantidade configurada de entradas/saídas
  - [x] Ao mudar ferramenta ativa, cursor/feedback muda

### 4.4 JS — Pathfinding & Exportação

- [x] Implementar script de resolução `js/pathfinding.js` com algoritmo BFS
- [x] Implementar destacamento visual (classe `.route-path`) de rota no grid
- [x] Implementar exportação baseada em Blob de um arquivo `maze.json`

### 4.5 JS — Painel de Configuração (Controls)

- [x] Implementar `js/controls.js`
  - [x] Input: **Linhas** (number, min: 2, max: 100, default: 10)
  - [x] Input: **Colunas** (number, min: 2, max: 100, default: 10)
  - [x] Input: **Tamanho do Tile** (number, min: 10, max: 200, default: 40, em pixels)
  - [x] Input: **Entradas** (number, min: 1, default: 1)
  - [x] Input: **Saídas** (number, min: 1, default: 1)
  - [x] Input: **Alias** (text, opcional)
  - [x] Botão: **Aplicar** — re-renderiza grid com novos parâmetros (reseta grid)
  - [x] Botão: **Salvar** — persiste labirinto via API
  - [x] Botão: **Auto-Gerar** — solicita geração ao servidor e carrega no grid
  - [x] Botão: **Calcular Rota** — destaca a menor rota com BFS
  - [x] Botão: **Exportar JSON** — gera e baixa o JSON com os dados do labirinto
  - [x] Validação em tempo real dos inputs

---

## Fase 5: Frontend — Listagem de Labirintos (P0)

**Agentes**: UI/UX, Frontend Integration

### 5.1 CSS — Estilos da Listagem

- [ ] Criar `css/list.css` (cards/items de labirinto, layout de lista)
- [ ] Implementar card de labirinto
  - [ ] Exibir alias (ou "Sem nome") como título
  - [ ] Exibir parâmetros: linhas × colunas, entradas, saídas
  - [ ] Exibir data de criação
  - [ ] Botão editar (navega para editor com dados carregados)
  - [ ] Botão excluir (com confirmação)

### 5.2 JS — Lista de Labirintos

- [x] Implementar `js/list.js`
  - [x] `loadMazesList()` — realiza fetch GET `/mazes` (com suporte a cache/paginação no futuro)
  - [x] Renderiza cada item como `.maze-card`
  - [x] Mensagem de "Nenhum labirinto salvo" caso vazio
- [x] Cada card deve exibir: Alias (ou texto vazio), Linhas, Colunas, Data de Criação
- [x] Ações em cada card:
  - [x] Botão **Editar**: transita para a aba Editor, realizando um `GET /mazes/:id` e preenchendo o `loadGrid()`
  - [x] Botão **Excluir**: confirma exclusão, faz um `DELETE /mazes/:id` e re-renderiza lista
- [x] Interação entre abas (tabs)
  - [x] Atualizar lista sempre que a aba "Lista de Labirintos" for focada

---

## Fase 6: Frontend — Integração com Backend (P0)

**Agentes**: Frontend Integration

### 6.1 JS — API Client

- [ ] Implementar `js/api.js`
  - [ ] Configuração de base URL (default: `http://localhost:3000`)
  - [ ] Função `fetchMazes(page, limit, search)` — GET /mazes
  - [ ] Função `fetchMaze(id)` — GET /mazes/:id
  - [ ] Função `createMaze(data)` — POST /mazes
  - [ ] Função `updateMaze(id, data)` — PATCH /mazes/:id
  - [ ] Função `deleteMaze(id)` — DELETE /mazes/:id
  - [ ] Função `generateMaze(params)` — POST /generator/generate
  - [ ] Tratamento de erros (network, validation, server)
  - [ ] Indicador de loading durante operações

### 6.2 JS — Navegação entre Views

- [ ] Implementar `js/app.js`
  - [ ] View: **Editor** (grid + controls — default)
  - [ ] View: **Lista** (listagem de labirintos)
  - [ ] Navegação via botões/tabs no header
  - [ ] Transição suave entre views
  - [ ] Ao clicar "Editar" na lista → carregar no editor
  - [ ] Ao clicar "Novo" → limpar editor

### 6.3 Fluxo Completo

- [ ] Testar: criar labirinto do zero → configurar → desenhar → salvar → ver na lista
- [ ] Testar: abrir labirinto existente → editar → salvar
- [ ] Testar: auto-gerar → editar → salvar
- [ ] Testar: excluir labirinto da lista
- [ ] Testar: buscar labirinto por alias

---

## Fase 7: Polimento & QA

**Agentes**: QA, UI/UX

### 7.1 Testes Backend

- [ ] Testes unitários: `mazes.service.ts`
- [ ] Testes unitários: `generator.service.ts`
- [ ] Testes unitários: `recursive-backtracking.ts`
- [ ] Testes E2E: todos os endpoints de `/mazes`
- [ ] Testes E2E: endpoint `/generator/generate`
- [ ] Testar validação de DTOs com dados inválidos
- [ ] Testar edge cases: grid 2×2, grid 100×100
- [ ] Testar: excluir labirinto inexistente → 404
- [ ] Testar: criar labirinto com grid corrompido → 400

### 7.2 Testes Frontend (Manual)

- [ ] Testar fluxo completo: criar → editar → salvar → listar → deletar
- [ ] Testar auto-geração com diversos parâmetros
- [ ] Testar edição de labirinto auto-gerado
- [ ] Testar validação de entradas/saídas (borda, quantidade)
- [ ] Testar responsividade em diferentes resoluções
- [ ] Testar grid grande (50×50) — performance de renderização
- [ ] Testar com network lenta (throttle no DevTools)
- [ ] Testar tratamento de erros (servidor offline)

### 7.3 Performance

- [ ] Verificar renderização do grid < 200ms para 50×50
- [ ] Verificar API response time < 300ms para CRUD
- [ ] Verificar API response time < 1s para geração
- [ ] Verificar interação com célula < 16ms (60fps)

### 7.4 Polimento UI

- [ ] Revisar cores e contraste (dark mode legível)
- [ ] Revisar tipografia e espaçamentos
- [ ] Adicionar transições suaves ao trocar de view
- [ ] Adicionar feedback visual para ações (salvar, excluir, gerar)
- [ ] Adicionar empty state na listagem (sem labirintos)
- [ ] Adicionar loading state nas operações assíncronas
- [ ] Garantir que o grid tem scroll correto em telas menores

---

## Fase 8: Deploy

**Agentes**: Architect, QA

### 8.1 Backend

- [ ] Containerizar backend (Dockerfile)
- [ ] Configurar PostgreSQL em produção
- [ ] Configurar variáveis de ambiente de produção
- [ ] Deploy em VPS ou cloud (Railway, Render, DigitalOcean, etc.)
- [ ] Configurar domínio e HTTPS
- [ ] Testar API em produção

### 8.2 Frontend

- [ ] Deploy em hosting estático (Vercel, Netlify ou Cloudflare Pages)
- [ ] Configurar URL da API de produção
- [ ] Testar em produção
- [ ] Validar CORS em produção

---

## Dependências entre Fases

```
Fase 1 (Setup — Backend + Frontend)
    │
    ├──→ Fase 2 (API CRUD — Backend)
    │         │
    │         ├──→ Fase 3 (API Geração — Backend)
    │         │
    │         └──→ Fase 6 (Integração Front ↔ Back)
    │
    ├──→ Fase 4 (Grid & Editor — Frontend)
    │         │
    │         └──→ Fase 6 (Integração Front ↔ Back)
    │
    ├──→ Fase 5 (Listagem — Frontend)
    │         │
    │         └──→ Fase 6 (Integração Front ↔ Back)
    │
    └──→ Fase 7 (QA — após Fase 6)
              │
              └──→ Fase 8 (Deploy — após QA)
```

> [!NOTE]
> As Fases 2-3 (backend) e 4-5 (frontend) podem ser desenvolvidas em paralelo. A Fase 6 (integração) depende de ambas as camadas estarem funcionais.

---

## Estimativa de Esforço

| Fase | Estimativa | Status |
|---|---|---|
| Fase 1: Setup & Scaffolding | 1 dia | Pendente |
| Fase 2: API CRUD de Labirintos | 2-3 dias | Pendente |
| Fase 3: API Auto-Geração | 1-2 dias | Pendente |
| Fase 4: Grid & Editor (Frontend) | 3-4 dias | Pendente |
| Fase 5: Listagem (Frontend) | 1-2 dias | Pendente |
| Fase 6: Integração Front ↔ Back | 1-2 dias | Pendente |
| Fase 7: QA & Polimento | 2-3 dias | Pendente |
| Fase 8: Deploy | 1 dia | Pendente |
| **Total estimado** | **12-18 dias** | — |
