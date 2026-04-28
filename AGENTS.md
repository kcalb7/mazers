# Mazers — Definição de Agentes (AGENTS)

> **Versão:** 1.0  
> **Data:** 2026-04-28  
> **Status:** Rascunho — Aguardando aprovação

---

## 1. Visão Geral

Este documento define os **agentes AI especializados** que serão utilizados durante o ciclo de desenvolvimento do Mazers. Cada agente possui um papel claro, escopo definido e regras de atuação para garantir qualidade, consistência e eficiência.

O Mazers possui **dois codebases** (frontend HTML/CSS/JS + backend NestJS), o que exige coordenação entre os agentes.

---

## 2. Agentes Definidos

### 2.1 🏗️ Architect Agent

**Papel**: Responsável por decisões arquiteturais e estrutura de ambos os projetos (frontend + backend).

**Escopo de atuação:**
- Definição e manutenção da estrutura de diretórios (frontend e backend).
- Decisões sobre padrões de código (módulos JS, organização CSS, módulos NestJS).
- Revisão de dependências (aprovar/rejeitar libs de terceiros).
- Garantir aderência ao padrão HTML/CSS/JS puro no frontend e NestJS no backend.
- Definição de interfaces entre camadas (Frontend ↔ API, API ↔ DB).
- Design de API endpoints e contratos de dados.
- Decisões de modelo de dados (PostgreSQL schema, formato JSONB).

**Regras:**
- Toda nova dependência deve ser justificada com: downloads/semana, última atualização, alternativa interna.
- Nunca aprovar libs que substituam funcionalidades simples implementáveis em vanilla JS.
- Manter a regra de "zero dependências no frontend" (exceto dev tools).
- Qualquer mudança arquitetural deve atualizar o SPECS.md.
- Qualquer evolução do app (funcionalidades, escopo) deve atualizar o PRD.md.
- Commitar sempre que algum dos .md forem alterados, contudo commitar somente os .md.
- Novas features e bugfix podem ser imediatamente commitados.
- Alterações devem ter seu commit autorizado.

**Contexto necessário:**
- PRD.md, SPECS.md
- package.json (backend)
- Estrutura de diretórios atuais
- prisma/schema.prisma

---

### 2.2 🎨 UI/UX Agent

**Papel**: Responsável pela interface visual, interações e experiência do usuário no painel web.

**Escopo de atuação:**
- Implementação do HTML e CSS de todas as telas.
- Design system (cores, tipografia, espaçamento — tema escuro).
- Renderização e interação com o grid de labirinto.
- Feedback visual ao editar células (hover, click, transições).
- Diferenciação visual por tipo de célula (parede, caminho, terreno, entrada, saída).
- Layout responsivo (desktop-first, adaptação para tablets).
- Painel de configurações abaixo do grid.
- Listagem de labirintos com cards/items.

**Regras:**
- Seguir paleta definida no PRD (tema escuro com acentos vibrantes).
- Componentes visuais devem usar CSS custom properties (variáveis).
- Células do grid devem ter transições suaves (CSS transitions).
- Grid deve ser renderizado via DOM elements (divs) — não Canvas (simplificidade do MVP).
- Animações via CSS (sem libs de animação).
- Layout simples, funcional, minimalista — nunca sobrecarregado.
- Ferramentas de edição (parede/caminho, terreno, entrada/saída) devem ser claras e acessíveis.

**Contexto necessário:**
- PRD.md (seção 10 — Design & UX)
- SPECS.md (estrutura do frontend)
- css/variables.css

---

### 2.3 🔌 API/Backend Agent

**Papel**: Responsável por toda a implementação do backend NestJS.

**Escopo de atuação:**
- Implementação do módulo de Mazes (CRUD completo).
- Implementação do módulo de Generator (auto-geração).
- Configuração do Prisma ORM e migrations.
- Implementação dos algoritmos de geração de labirintos.
- Validação de dados (DTOs + class-validator).
- Tratamento de erros e logging.
- Configuração de CORS e rate limiting.

**Regras:**
- Todo endpoint deve ter validação completa via DTOs.
- O campo `grid` (JSONB) deve ser validado: dimensões, tipos, roles de borda.
- Paginação obrigatória na listagem de labirintos.
- API deve retornar erros padronizados com códigos HTTP apropriados.
- Algoritmo de geração deve ser implementado como strategy pattern (interface + implementações).
- Nunca expor campos internos do banco (usar transform/serialization).
- Rate limiting ativo em todos os endpoints.
- Logging estruturado para debug e auditoria.

**Contexto necessário:**
- SPECS.md (seções 4, 5, 6, 7)
- PRD.md (seções 4, 5, 7, 8)
- prisma/schema.prisma
- Documentação NestJS, Prisma

---

### 2.4 🖥️ Frontend Integration Agent

**Papel**: Responsável pela lógica JavaScript do frontend e comunicação com o backend.

**Escopo de atuação:**
- Implementação do módulo `api.js` (fetch wrapper, error handling).
- Lógica de renderização do grid (criação dinâmica de elementos DOM).
- Lógica do editor (ferramentas: parede/caminho, terreno, entrada/saída).
- Lógica dos controles de configuração (inputs, validação client-side).
- Lógica da listagem de labirintos (load, search, pagination).
- Construção do objeto JSON do labirinto a partir do estado do grid.
- Parsing do JSON recebido do backend para renderização no grid.

**Regras:**
- Usar ES6+ modules (`import/export`) com `type="module"` no HTML.
- Toda operação de rede deve ser assíncrona (async/await com fetch).
- Validação client-side deve espelhar as regras do backend (fail-fast).
- Estado do grid deve ser mantido em memória como array bidimensional.
- Renderização do grid deve ser eficiente: evitar re-renders desnecessários.
- Tratar falhas de rede graciosamente (mensagens claras ao usuário).
- Código organizado em classes ou módulos com responsabilidades claras.

**Contexto necessário:**
- SPECS.md (seções 5, 6, 8)
- PRD.md (seções 4, 7)
- js/*.js

---

### 2.5 🧪 QA Agent

**Papel**: Garantia de qualidade, testes e validação de ambos os codebases.

**Escopo de atuação:**
- Escrever e manter testes unitários do backend (Jest — NestJS).
- Escrever testes E2E da API (Supertest + Jest).
- Testar algoritmo de geração com diversos parâmetros.
- Validar fluxos críticos manualmente no browser.
- Verificar performance (targets do SPECS.md).
- Verificar integridade de dados (JSON salvo corresponde ao grid editado).
- Testar edge cases (grids mínimos 2×2, grids grandes 100×100).

**Regras:**
- Todo service do backend deve ter testes unitários.
- Endpoints da API devem ter testes E2E.
- Algoritmo de geração deve ter testes que validem: labirinto solvável, entradas/saídas corretas, dimensões corretas.
- Testar fluxos: criar → editar → salvar → listar → deletar.
- Validar que o JSON persistido reconstrói o grid corretamente.
- Testar auto-geração + edição + salvamento.
- Testar edge cases de validação (params inválidos, grid corrompido).

**Contexto necessário:**
- PRD.md (requisitos não-funcionais)
- SPECS.md (performance targets, API contracts)
- Código-fonte atual (ambos projetos)

---

## 3. Fluxo de Trabalho entre Agentes

```
┌─────────────────┐
│    Architect     │
│     Agent        │
└────────┬────────┘
         │ Define estrutura e interfaces
         ├──────────────────────────────────────────┐
         │                                          │
         ▼                                          ▼
┌─────────────────┐                      ┌─────────────────┐
│   API/Backend   │ ◄──── Contratos ────►│    UI/UX        │
│   Agent         │       de API          │    Agent        │
└────────┬────────┘                      └────────┬────────┘
         │                                         │
         │          ┌─────────────────┐            │
         └─────────►│   Frontend      │◄───────────┘
                    │   Integration   │
                    │   Agent         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   QA Agent      │
                    └─────────────────┘
```

**Fluxo:**
1. **Architect** define a estrutura, interfaces e contratos de API.
2. **API/Backend** implementa os endpoints, CRUD e algoritmo de geração.
3. **UI/UX** implementa as telas, grid e estilos visuais.
4. **Frontend Integration** conecta o frontend ao backend via fetch API.
5. **QA** valida cada implementação (ambos os codebases).
6. **Architect** revisa e aprova.

---

## 4. Regras Globais (Todos os Agentes)

- **Confirmação de Fase**: Somente avance para a próxima fase do projeto após confirmação explícita do usuário.
- **Sincronização de Documentação**: Sempre que uma fase for finalizada, os arquivos `.md` (PRD, SPECS, TASKS, AGENTS) devem ser obrigatoriamente atualizados com o progresso real e ajustes necessários.
- **Verificação de Tipos (Backend)**: Sempre verificar erros de TypeScript (`npx tsc --noEmit`) ao finalizar qualquer fase, módulo, feature, fix ou chore. **Obrigatório realizar esta verificação antes de qualquer commit.**
- **Teste com Build**: Sempre que algo for ajustado, alterado, acrescentado ou removido, testar obrigatoriamente com build (`npm run build` no backend, verificação manual no frontend) para garantir integridade.
- **Teste com Dev Server**: Após qualquer alteração no backend, rodar `npm run start:dev` para validar que o servidor inicializa sem erros. No frontend, verificar no browser que a página carrega e funciona corretamente.

### 4.1 Código — Backend

- **TypeScript strict mode** — sempre.
- **Sem `any`** — tipagem completa em todas as interfaces, DTOs, services e controllers.
- **Nomes descritivos** — variáveis, funções, classes.
- **Funções puras** quando possível.
- **Tratamento de erros** — try/catch com logging apropriado. Usar `Logger` do NestJS, nunca `console.log` direto.
- **Comentários** — apenas para lógica complexa ou decisões não-óbvias.
- **Validação rigorosa** — todo input do usuário deve ser validado via DTOs com `class-validator`. Nunca confiar em dados do frontend.
- **Serialização** — nunca expor campos internos do banco diretamente. Usar `class-transformer` para controlar o output.
- **Operações assíncronas** — toda operação de banco deve ser `async/await`. Nunca bloquear o event loop.

### 4.2 Código — Frontend

- **JavaScript ES6+** com modules (`import/export`, `type="module"` no HTML).
- **Sem globals** desnecessários — usar módulos para encapsular estado e lógica.
- **Nomes descritivos** e consistentes em variáveis, funções e classes.
- **CSS organizado** em arquivos separados por responsabilidade (variables, layout, grid, controls, list, components).
- **Sem `!important`** — resolver especificidade corretamente via seletores.
- **Sem inline styles** — usar classes CSS exclusivamente.
- **Tratamento de erros** — toda operação de rede (fetch) deve ter try/catch com feedback visual ao usuário.
- **Validação client-side** — espelhar as mesmas regras de validação do backend para fail-fast no frontend.
- **Performance** — evitar re-renders desnecessários do grid. Atualizar apenas as células que mudaram.

### 4.3 Padrão NestJS (Backend)

- Seguir **modular architecture** com separação clara de responsabilidades.
- **Controllers** para routing — nunca lógica de negócio em controllers.
- **Services** para lógica de negócio — toda regra de negócio deve estar no service.
- **DTOs** com **class-validator** para toda entrada de dados — nunca aceitar body sem validação.
- **Prisma** para acesso ao banco — nunca queries SQL raw (exceto otimizações extremas justificadas).
- **Global Exception Filter** configurado para padronizar respostas de erro.
- **Global Validation Pipe** configurado com `whitelist: true` e `forbidNonWhitelisted: true`.

### 4.4 Padrão Frontend (HTML/CSS/JS)

- Código organizado em **módulos ES6** com responsabilidades claras (`api.js`, `grid.js`, `editor.js`, `controls.js`, `list.js`).
- Estado do grid mantido em memória como **array bidimensional** — nunca ler estado do DOM.
- Toda operação de rede deve ser **assíncrona** (async/await com fetch).
- CSS deve usar **custom properties** (variáveis) definidas em `variables.css` — nunca hardcoding de cores/fontes.
- Grid renderizado via **DOM elements** (divs) — não Canvas (simplicidade do MVP).
- Animações e transições via **CSS** (sem libs de animação JavaScript).

### 4.5 Git

- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- **Branch strategy**: `main` → `develop` → `feature/*`, `fix/*`.
- **Zero Errors**: Nunca realizar um commit no backend sem antes rodar `npx tsc --noEmit` e garantir que não existam erros de tipo.
- **Nunca commitar** `.env`, secrets, credenciais, ou `docker-compose.override.yml`.
- `.gitignore` rigoroso para `node_modules/`, `dist/`, `.env`, `*.log`.
- **Repositories**: O projeto terá o backend `mazers-api` e frontend `mazers-panel` (ou monorepo a decidir).
- Commitar sempre que algum dos `.md` for alterado, contudo commitar somente os `.md`.
- Novas features e bugfix podem ser imediatamente commitados após aprovação.
- Alterações devem ter seu commit autorizado.

### 4.6 Documentação

- Atualizar **PRD.md** quando requisitos mudarem.
- Atualizar **SPECS.md** quando especificações técnicas mudarem.
- Atualizar **TASKS.md** conforme progresso.
- README.md com setup local e instruções de desenvolvimento (ambos projetos).

---

## 5. Contexto por Fase de Desenvolvimento

| Fase | Agentes Primários | Agentes de Suporte |
|---|---|---|
| **Setup & Scaffolding** | Architect | — |
| **Database & Schema** | API/Backend, Architect | — |
| **API Endpoints (CRUD)** | API/Backend | Architect, QA |
| **Algoritmo de Geração** | API/Backend | Architect, QA |
| **Grid UI & Rendering** | UI/UX, Frontend Integration | QA |
| **Editor (Ferramentas)** | UI/UX, Frontend Integration | QA |
| **Listagem de Labirintos** | UI/UX, Frontend Integration | QA |
| **Integração Front ↔ Back** | Frontend Integration | API/Backend, QA |
| **Testes & Polimento** | QA | Todos |
| **Deploy** | Architect | QA |
