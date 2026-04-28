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

- [ ] Criar módulo `mazes/` (module, controller, service)
- [ ] Implementar DTOs com class-validator
  - [ ] `create-maze.dto.ts` (alias, rows, cols, tileSize, entrances, exits, grid)
  - [ ] `update-maze.dto.ts` (partial de create)
- [ ] Implementar `mazes.service.ts`
  - [ ] `findAll(page, limit, search)` — listagem paginada (sem grid no retorno)
  - [ ] `findOne(id)` — retorna labirinto completo (com grid)
  - [ ] `create(dto)` — cria novo labirinto
  - [ ] `update(id, dto)` — atualiza labirinto existente
  - [ ] `remove(id)` — remove labirinto
- [ ] Implementar `mazes.controller.ts`
  - [ ] `GET /mazes` (listagem paginada + busca por alias)
  - [ ] `GET /mazes/:id`
  - [ ] `POST /mazes`
  - [ ] `PATCH /mazes/:id`
  - [ ] `DELETE /mazes/:id`
- [ ] Implementar validação do grid
  - [ ] Dimensões do grid devem corresponder a rows × cols
  - [ ] Quantidade de entradas/saídas no grid deve corresponder aos parâmetros
  - [ ] Entradas/saídas devem estar na borda do grid
  - [ ] Tipos válidos: wall, path
  - [ ] Terrenos válidos: stone, sand
  - [ ] Roles válidos: entrance, exit, null
- [ ] Configurar CORS no `main.ts`
- [ ] Configurar rate limiting (`@nestjs/throttler`)
- [ ] Configurar global validation pipe
- [ ] Testes unitários do service
- [ ] Testes E2E dos endpoints

### 2.2 Backend — Prisma Service

- [ ] Criar módulo `prisma/` (module, service)
- [ ] Implementar `prisma.service.ts` (extends PrismaClient, onModuleInit)
- [ ] Registrar como módulo global

---

## Fase 3: API — Auto-Geração de Labirintos (P0)

**Agentes**: API/Backend, Architect

### 3.1 Backend — Generator Module

- [ ] Criar módulo `generator/` (module, controller, service)
- [ ] Implementar interface `MazeAlgorithm`
  ```typescript
  interface MazeAlgorithm {
    generate(rows: number, cols: number, entrances: number, exits: number): MazeCell[][];
  }
  ```
- [ ] Implementar `algorithms/recursive-backtracking.ts`
  - [ ] Inicializar grid com todas as células como parede
  - [ ] Implementar DFS com backtracking
  - [ ] Cavar caminhos (marcar como path) durante travessia
  - [ ] Posicionar entradas na borda esquerda/superior
  - [ ] Posicionar saídas na borda direita/inferior
  - [ ] Garantir adjacência entre entrada/saída e caminho interno
  - [ ] Definir terreno aleatório (stone/sand) para cada célula de caminho
- [ ] Implementar `generator.service.ts`
  - [ ] `generate(rows, cols, entrances, exits)` — orquestra a geração
  - [ ] Validação: parâmetros válidos, entradas/saídas cabem na borda
- [ ] Implementar `generator.controller.ts`
  - [ ] `POST /generator/generate`
- [ ] Implementar DTOs de geração (generate-maze.dto.ts)
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
  - [ ] Caminho: `#ecf0f1` (light)
  - [ ] Entrada: `#2ecc71` (green)
  - [ ] Saída: `#e74c3c` (red)
  - [ ] Pedra (terreno): `#7f8c8d` (stone gray)
  - [ ] Areia (terreno): `#f39c12` (sandy/amber)
- [ ] Implementar hover state nas células
- [ ] Implementar transições CSS para mudança de estado
- [ ] Implementar toolbar de ferramentas do editor

### 4.2 JS — Renderização do Grid

- [ ] Implementar `js/grid.js`
  - [ ] Função `renderGrid(rows, cols, tileSize)` — cria elementos DOM do grid
  - [ ] Função `updateCell(row, col, cellData)` — atualiza visual de uma célula
  - [ ] Função `clearGrid()` — remove grid atual
  - [ ] Função `getGridData()` — retorna estado atual do grid como array 2D
  - [ ] Função `loadGrid(gridData)` — carrega grid a partir de dados existentes
- [ ] Grid deve ser responsivo (scroll horizontal se ultrapassar viewport)
- [ ] Cada célula deve exibir indicador visual do tipo, terreno e role

### 4.3 JS — Editor (Ferramentas)

- [ ] Implementar `js/editor.js`
  - [ ] Ferramenta: **Parede/Caminho** — click alterna entre wall e path
  - [ ] Ferramenta: **Terreno** — click define pedra ou areia (dropdown/toggle)
  - [ ] Ferramenta: **Entrada** — click marca célula como entrada (validar borda e quantidade)
  - [ ] Ferramenta: **Saída** — click marca célula como saída (validar borda e quantidade)
  - [ ] Ferramenta ativa deve ter indicação visual (botão highlighted)
  - [ ] Validação: entrada/saída só em bordas
  - [ ] Validação: não exceder quantidade configurada de entradas/saídas
  - [ ] Ao mudar ferramenta ativa, cursor/feedback muda

### 4.4 JS — Painel de Configuração (Controls)

- [ ] Implementar `js/controls.js`
  - [ ] Input: **Linhas** (number, min: 2, max: 100, default: 10)
  - [ ] Input: **Colunas** (number, min: 2, max: 100, default: 10)
  - [ ] Input: **Tamanho do Tile** (number, min: 10, max: 200, default: 40, em pixels)
  - [ ] Input: **Entradas** (number, min: 1, default: 1)
  - [ ] Input: **Saídas** (number, min: 1, default: 1)
  - [ ] Input: **Alias** (text, opcional)
  - [ ] Botão: **Aplicar** — re-renderiza grid com novos parâmetros (reseta grid)
  - [ ] Botão: **Salvar** — persiste labirinto via API
  - [ ] Botão: **Auto-Gerar** — solicita geração ao servidor e carrega no grid
  - [ ] Validação em tempo real dos inputs

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

- [ ] Implementar `js/list.js`
  - [ ] Função `loadMazes(page, search)` — busca labirintos do backend
  - [ ] Função `renderMazeList(mazes)` — renderiza cards/items
  - [ ] Função `deleteMaze(id)` — exclui com confirmação
  - [ ] Paginação (botões prev/next, indicador de página)
  - [ ] Busca por alias (input de busca com debounce)
  - [ ] Ao clicar em "Editar": carregar labirinto no editor

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
