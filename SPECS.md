# Mazers — Especificações Técnicas (SPECS)

> **Versão:** 1.0  
> **Data:** 2026-04-28  
> **Status:** Rascunho — Aguardando aprovação

---

## 1. Decisões Técnicas

### 1.1 Frontend: HTML/CSS/JS Puro

| Critério | HTML/CSS/JS Puro | React/Vue/Angular |
|---|---|---|
| **Complexidade** | Baixa | Média-Alta |
| **Dependências** | Zero | npm packages |
| **Bundle size** | Mínimo (~50KB) | 100KB-500KB+ |
| **Tempo para MVP** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Curva de aprendizado** | Nenhuma | Moderada |
| **Build system** | Nenhum (live-server) | Webpack/Vite |
| **Manutenção** | Manual (vanilla) | Componentes reutilizáveis |

**Justificativa**: O painel é uma aplicação de escopo controlado — um editor de grid e uma listagem. Usar um framework seria overengineering para o MVP. HTML/CSS/JS puro garante leveza, simplicidade e zero configuração de build.

> [!NOTE]
> Caso o projeto cresça significativamente (autenticação, multi-usuário, permissões), poderá ser avaliada a migração para um framework como Vite + Vanilla TS ou até React.

### 1.2 Backend: NestJS

**Justificativa**: NestJS oferece uma arquitetura modular madura, suporte nativo a TypeScript, validação de DTOs via decorators, e excelente integração com ORMs. Ideal para API REST com lógica de auto-geração.

### 1.3 ORM: Prisma

**Justificativa**: Prisma oferece type safety, migrations automáticos, e DX superior com auto-complete. Ideal para o schema simples do Mazers.

### 1.4 Banco de Dados: PostgreSQL

**Justificativa**: Armazenamento do JSON do labirinto beneficia-se do tipo `jsonb` nativo do PostgreSQL, permitindo queries e indexação dentro da estrutura JSON se necessário futuramente.

### 1.5 Algoritmo de Auto-Geração: Recursive Backtracking

**Justificativa**: É o algoritmo mais common e intuitivo para geração de labirintos perfeitos (sem loops, exatamente um caminho entre quaisquer dois pontos). Produz labirintos com passagens longas e interessantes. Alternativas para fases futuras: Hunt-and-Kill, Prim's, Kruskal's.

---

## 2. Arquitetura da Aplicação

### 2.1 Visão Geral

```
┌──────────────────────────────────────────────────────────────┐
│              CAMADA DE APRESENTAÇÃO (Frontend)                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │         Web Panel (HTML + CSS + JavaScript)             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ Editor View  │  │ Grid Canvas  │  │ List View   │  │  │
│  │  │ (config +    │  │ (maze grid   │  │ (maze       │  │  │
│  │  │  controls)   │  │  rendering)  │  │  listing)   │  │  │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────┬────────────────────────────┘  │
│                              │ fetch API                      │
├──────────────────────────────┴───────────────────────────────┤
│                CAMADA DE API (NestJS Backend)                  │
│  ┌───────────────────┐  ┌────────────────────────────────┐   │
│  │  Mazes Module     │  │  Generator Module              │   │
│  │  (CRUD)           │  │  (Auto-generation algorithms)  │   │
│  ├───────────────────┤  ├────────────────────────────────┤   │
│  │  Controller       │  │  Service (Recursive Backtrack) │   │
│  │  Service          │  │                                │   │
│  │  DTOs             │  │                                │   │
│  └───────────────────┘  └────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│                CAMADA DE DADOS                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  PostgreSQL                                           │    │
│  │  ┌─────────────────────────────────────────────────┐ │    │
│  │  │  mazes (id, alias, config, grid jsonb, ...)     │ │    │
│  │  └─────────────────────────────────────────────────┘ │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Padrão Arquitetural

**Frontend (HTML/CSS/JS):**
- **Multi-page ou SPA leve**: Duas views (editor e listagem) alternadas via JavaScript.
- **Fetch API** para comunicação com o backend.
- **CSS Modules** (ou BEM naming) para organização de estilos.
- **Vanilla JS** com classes/módulos ES6 para organização de código.

**Backend (NestJS):**
- **Modular architecture**: Módulos separados para CRUD e geração.
- **DTOs + class-validator** para validação de dados.
- **Prisma ORM** para acesso ao PostgreSQL.
- **CORS** configurado para aceitar requisições do frontend.

---

## 3. Tech Stack

### 3.1 Frontend

| Tecnologia | Propósito |
|---|---|
| **HTML5** | Estrutura das páginas |
| **CSS3** | Estilização (CSS custom properties, flexbox, grid) |
| **JavaScript (ES6+)** | Lógica de interação, renderização do grid, comunicação com API |
| **Google Fonts (Inter)** | Tipografia |

### 3.2 Backend

| Tecnologia | Versão | Propósito |
|---|---|---|
| **NestJS** | 10+ | Framework backend (TypeScript) |
| **Prisma** | 6+ | ORM para PostgreSQL |
| **PostgreSQL** | 16+ | Banco de dados relacional |
| **class-validator** | latest | Validação de DTOs |
| **class-transformer** | latest | Transformação de dados |

### 3.3 Desenvolvimento

| Tecnologia | Propósito |
|---|---|
| **live-server** ou **http-server** | Dev server para o frontend (hot reload) |
| **Docker Compose** | PostgreSQL local para desenvolvimento |
| **Node.js 20+** | Runtime do backend |

---

## 4. Modelo de Dados

### 4.1 PostgreSQL — Schema

```sql
-- Labirintos
CREATE TABLE mazes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alias TEXT,                                      -- Nome amigável (opcional)
  rows INTEGER NOT NULL CHECK (rows >= 2),         -- Número de linhas
  cols INTEGER NOT NULL CHECK (cols >= 2),          -- Número de colunas
  tile_size INTEGER NOT NULL DEFAULT 40,           -- Tamanho do tile em pixels
  entrances INTEGER NOT NULL DEFAULT 1 CHECK (entrances >= 1),  -- Qtd de entradas
  exits INTEGER NOT NULL DEFAULT 1 CHECK (exits >= 1),          -- Qtd de saídas
  grid JSONB NOT NULL,                             -- Grid completo do labirinto
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mazes_alias ON mazes(alias);
CREATE INDEX idx_mazes_created_at ON mazes(created_at DESC);
```

### 4.2 Estrutura do `grid` (JSONB)

O campo `grid` armazena uma **matriz bidimensional** (array de arrays) de objetos de célula:

```typescript
interface MazeCell {
  row: number;       // Índice da linha (0-indexed)
  col: number;       // Índice da coluna (0-indexed)
  type: 'wall' | 'path';          // Parede ou caminho
  terrain: 'stone' | 'sand';      // Tipo de terreno
  role: 'entrance' | 'exit' | null; // Papel especial (entrada, saída, ou nenhum)
}

interface MazeGrid {
  [rowIndex: number]: MazeCell[];
}
```

### 4.3 Interface Completa do Labirinto

```typescript
interface Maze {
  id: string;           // UUID
  alias: string | null;  // Nome amigável
  rows: number;          // Número de linhas
  cols: number;          // Número de colunas
  tileSize: number;      // Tamanho do tile (px)
  entrances: number;     // Quantidade de entradas
  exits: number;         // Quantidade de saídas
  grid: MazeCell[][];    // Grid bidimensional
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601
}
```

---

## 5. Estrutura de Diretórios

### 5.1 Frontend (HTML/CSS/JS)

```
mazers-panel/
├── index.html                    # Página principal (editor + listagem)
├── css/
│   ├── reset.css                 # CSS reset
│   ├── variables.css             # Design tokens (cores, fontes, espaçamentos)
│   ├── layout.css                # Layout geral (header, main, footer)
│   ├── grid.css                  # Estilos do grid do labirinto
│   ├── controls.css              # Estilos do painel de configuração
│   ├── list.css                  # Estilos da listagem de labirintos
│   └── components.css            # Botões, inputs, cards, modais
├── js/
│   ├── app.js                    # Entry point — inicialização e roteamento de views
│   ├── api.js                    # Comunicação com o backend (fetch wrapper)
│   ├── grid.js                   # Renderização e interação com o grid
│   ├── editor.js                 # Lógica do editor (ferramentas: wall/path, terrain, roles)
│   ├── controls.js               # Painel de configuração (inputs, validação)
│   ├── list.js                   # Listagem de labirintos
│   ├── maze.js                   # Modelo de dados do labirinto (classe/builder)
│   └── utils.js                  # Utilitários (formatação, validação)
├── assets/
│   ├── icons/                    # Ícones SVG (ferramentas, ações)
│   └── images/                   # Imagens estáticas
├── PRD.md
├── SPECS.md
├── AGENTS.md
└── TASKS.md
```

### 5.2 Backend (NestJS)

```
mazers-api/
├── src/
│   ├── main.ts                   # Bootstrap
│   ├── app.module.ts             # Root module
│   │
│   ├── mazes/                    # Módulo de labirintos (CRUD)
│   │   ├── mazes.module.ts
│   │   ├── mazes.controller.ts
│   │   ├── mazes.service.ts
│   │   └── dto/
│   │       ├── create-maze.dto.ts
│   │       └── update-maze.dto.ts
│   │
│   ├── generator/                # Módulo de auto-geração
│   │   ├── generator.module.ts
│   │   ├── generator.controller.ts
│   │   ├── generator.service.ts
│   │   └── algorithms/
│   │       ├── recursive-backtracking.ts
│   │       └── maze-algorithm.interface.ts
│   │
│   ├── prisma/                   # Prisma service
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   └── common/                   # Shared utilities
│       ├── filters/
│       │   └── http-exception.filter.ts
│       └── pipes/
│           └── validation.pipe.ts
│
├── prisma/
│   ├── schema.prisma             # Prisma schema
│   └── migrations/               # Database migrations
│
├── docker-compose.yml            # PostgreSQL para desenvolvimento
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```

---

## 6. API Endpoints

### 6.1 Labirintos (CRUD)

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/mazes` | Lista todos os labirintos (paginado) |
| GET | `/mazes/:id` | Retorna um labirinto por ID |
| POST | `/mazes` | Cria um novo labirinto |
| PATCH | `/mazes/:id` | Atualiza um labirinto existente |
| DELETE | `/mazes/:id` | Remove um labirinto |

### 6.2 Auto-Geração

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/generator/generate` | Gera um labirinto automaticamente com base nos parâmetros |

### 6.3 Detalhamento dos Endpoints

#### `GET /mazes`

**Query Params:**
- `page` (number, default: 1) — Página atual
- `limit` (number, default: 20) — Itens por página
- `search` (string, optional) — Busca por alias

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "alias": "Labirinto 1",
      "rows": 10,
      "cols": 10,
      "tileSize": 40,
      "entrances": 1,
      "exits": 1,
      "createdAt": "2026-04-28T00:00:00Z",
      "updatedAt": "2026-04-28T00:00:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

> [!NOTE]
> A listagem **não retorna o campo `grid`** para otimizar payload. O grid completo é retornado apenas no `GET /mazes/:id`.

#### `GET /mazes/:id`

**Response (200):**
```json
{
  "id": "uuid",
  "alias": "Labirinto 1",
  "rows": 10,
  "cols": 10,
  "tileSize": 40,
  "entrances": 1,
  "exits": 1,
  "grid": [[ { "row": 0, "col": 0, "type": "wall", "terrain": "stone", "role": null } ]],
  "createdAt": "2026-04-28T00:00:00Z",
  "updatedAt": "2026-04-28T00:00:00Z"
}
```

#### `POST /mazes`

**Body:**
```json
{
  "alias": "Labirinto 1",
  "rows": 10,
  "cols": 10,
  "tileSize": 40,
  "entrances": 1,
  "exits": 1,
  "grid": [[ { "row": 0, "col": 0, "type": "wall", "terrain": "stone", "role": null } ]]
}
```

**Validações:**
- `rows`: integer, ≥ 2, ≤ 100
- `cols`: integer, ≥ 2, ≤ 100
- `tileSize`: integer, ≥ 10, ≤ 200
- `entrances`: integer, ≥ 1
- `exits`: integer, ≥ 1
- `grid`: array bidimensional, dimensões devem corresponder a rows × cols
- Quantidade de entradas/saídas no grid deve corresponder aos parâmetros
- Entradas e saídas devem estar na borda

#### `POST /generator/generate`

**Body:**
```json
{
  "rows": 15,
  "cols": 15,
  "entrances": 1,
  "exits": 1
}
```

**Response (200):**
```json
{
  "grid": [[ { "row": 0, "col": 0, "type": "wall", "terrain": "stone", "role": null } ]],
  "rows": 15,
  "cols": 15,
  "entrances": 1,
  "exits": 1
}
```

> [!NOTE]
> A auto-geração **não persiste** o labirinto. Ela retorna o grid gerado para o frontend exibir no editor. O usuário pode então editar e salvar via `POST /mazes`.

---

## 7. Algoritmo de Auto-Geração

### 7.1 Recursive Backtracking

```
1. Inicializar grid com todas as células como PAREDE (wall)
2. Escolher célula inicial (1,1) e marcá-la como CAMINHO (path)
3. Empurrar célula para a pilha (stack)
4. Enquanto pilha não estiver vazia:
   a. Célula atual = topo da pilha
   b. Encontrar vizinhos não visitados (a 2 células de distância)
   c. Se houver vizinhos não visitados:
      - Escolher vizinho aleatório
      - Remover parede entre célula atual e vizinho (marcar como path)
      - Marcar vizinho como path
      - Empurrar vizinho para a pilha
   d. Se não houver vizinhos:
      - Desempilhar (backtrack)
5. Posicionar entradas e saídas nas bordas do labirinto
6. Definir terreno aleatório para cada célula de caminho (stone ou sand)
```

### 7.2 Regras de Entradas e Saídas

- Entradas são posicionadas preferencialmente na borda **esquerda** ou **superior**.
- Saídas são posicionadas preferencialmente na borda **direita** ou **inferior**.
- A célula de entrada/saída deve estar **adjacente a um caminho** interno.
- Se a quantidade solicitada de entradas/saídas exceder as posições válidas disponíveis na borda, o algoritmo retornará erro.

---

## 8. Comunicação Frontend ↔ Backend

### 8.1 Configuração

- **Backend URL**: Configurável via variável no `api.js` (default: `http://localhost:3000`)
- **CORS**: Backend configurado para aceitar `*` no desenvolvimento, restrito em produção.
- **Content-Type**: `application/json` em todas as requisições.

### 8.2 Tratamento de Erros

**Formato padrão de erro (Backend):**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "rows",
      "message": "rows must be at least 2"
    }
  ]
}
```

**Frontend:**
- Exibir mensagens de erro inline nos campos de configuração.
- Toast/notification para erros de rede ou do servidor.
- Feedback visual ao salvar/deletar com sucesso.

---

## 9. Performance Targets

| Métrica | Target |
|---|---|
| **Renderização do grid** | < 200ms para grids ≤ 50×50 |
| **Resposta da API (CRUD)** | < 300ms p95 |
| **Resposta da API (geração)** | < 1s para grids ≤ 50×50 |
| **First paint** | < 1s |
| **Interação com célula** | < 16ms (60fps) |

---

## 10. Segurança (MVP)

> [!WARNING]
> O MVP não possui autenticação. A API estará exposta. Medidas mínimas:

| Medida | Implementação |
|---|---|
| **Rate limiting** | `@nestjs/throttler` — máx 100 req/min por IP |
| **Input validation** | DTOs com class-validator em todos os endpoints |
| **SQL injection** | Prisma ORM (parameterized queries) |
| **CORS** | Restrito ao domínio do frontend em produção |
| **Payload size** | Limite de body size (1MB) para evitar abuse |
