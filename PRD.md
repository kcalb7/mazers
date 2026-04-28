# Mazers — Product Requirements Document (PRD)

> **Versão:** 1.0  
> **Data:** 2026-04-28  
> **Status:** Rascunho — Aguardando aprovação

---

## 1. Visão do Produto

O **Mazers** é um painel web para criação, edição e gerenciamento de labirintos em grade (grid-based mazes). Ele permite ao usuário configurar parâmetros do labirinto (dimensões, tamanho de tile, entradas e saídas), desenhar manualmente cada célula (parede ou caminho, tipo de terreno), e também auto-gerar labirintos via servidor. Todos os dados são persistidos em um banco de dados PostgreSQL através de uma API NestJS.

> [!NOTE]
> **Estratégia de plataforma**: Web-first (HTML/CSS/JS puro) para lançamento rápido do MVP. Futuramente, o painel poderá evoluir para um editor mais robusto com funcionalidades avançadas.

### 1.1 Problema

- Criar labirintos manualmente é tedioso sem uma ferramenta visual dedicada.
- Não existe uma forma prática de configurar, visualizar e persistir labirintos com parâmetros flexíveis.
- Algoritmos de geração automática de labirintos não possuem uma interface de fácil interação.
- Armazenar labirintos como JSON requer uma camada de persistência e organização.

### 1.2 Solução

Um painel web que:
- Permite configurar labirintos com parâmetros de linhas, colunas, tamanho de tile, número de entradas e saídas.
- Exibe um grid interativo onde cada célula pode ser definida como **parede** ou **caminho**.
- Permite definir o **tipo de terreno** de cada célula (Pedra, Areia).
- Permite marcar **entradas** e **saídas** do labirinto conforme as quantidades configuradas.
- Permite definir um **alias** (nome) para cada labirinto.
- Armazena toda a estrutura do labirinto como **JSON** no banco de dados.
- Oferece funcionalidade de **auto-geração** de labirintos pelo servidor.
- Lista todos os labirintos criados, identificados por seus parâmetros ou alias.

---

## 2. Atores do Sistema

| Ator | Descrição |
|---|---|
| **Usuário (Editor)** | Pessoa que cria, edita e gerencia labirintos através do painel. |

> [!NOTE]
> Inicialmente não haverá autenticação. Todos os usuários terão acesso irrestrito ao painel. Autenticação e níveis de permissão serão implementados em versão futura.

---

## 3. Público-Alvo

| Segmento | Descrição |
|---|---|
| **Desenvolvedores de jogos** | Profissionais que precisam criar e testar labirintos para seus games. |
| **Designers de níveis** | Pessoas que projetam níveis baseados em grid para jogos ou aplicações educacionais. |
| **Entusiastas de puzzles** | Qualquer pessoa interessada em criar e compartilhar labirintos. |

---

## 4. User Stories

### 4.1 Configuração do Labirinto

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-01 | Usuário | configurar o número de **linhas** do labirinto | eu defina a altura do grid |
| US-02 | Usuário | configurar o número de **colunas** do labirinto | eu defina a largura do grid |
| US-03 | Usuário | configurar o tamanho do **tile** (lado do quadrado) | eu controle a escala visual do labirinto |
| US-04 | Usuário | configurar a **quantidade de entradas** | eu defina por onde se inicia o labirinto |
| US-05 | Usuário | configurar a **quantidade de saídas** | eu defina por onde se termina o labirinto |
| US-06 | Usuário | definir um **alias** (nome) para o labirinto | eu identifique facilmente cada labirinto |

### 4.2 Edição do Labirinto

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-07 | Usuário | clicar em uma célula para alternar entre **parede** e **caminho** | eu desenhe o layout do labirinto |
| US-08 | Usuário | selecionar o **tipo de terreno** (Pedra ou Areia) para cada célula | eu diferencie áreas do labirinto |
| US-09 | Usuário | marcar células como **entrada** | eu defina os pontos de início |
| US-10 | Usuário | marcar células como **saída** | eu defina os pontos de término |
| US-11 | Usuário | visualizar o labirinto no grid conforme edito | eu tenha feedback visual imediato |

### 4.3 Persistência e Listagem

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-12 | Usuário | salvar o labirinto com todas suas configurações em JSON | eu persista meu trabalho |
| US-13 | Usuário | ver uma **lista de labirintos** criados | eu acesse rapidamente qualquer labirinto |
| US-14 | Usuário | identificar labirintos por alias ou parâmetros na lista | eu saiba qual labirinto é qual |
| US-15 | Usuário | editar um labirinto existente | eu faça ajustes sem recriar do zero |
| US-16 | Usuário | excluir um labirinto | eu remova labirintos desnecessários |

### 4.4 Auto-Geração

| ID | Como... | Eu quero... | Para que... |
|---|---|---|---|
| US-17 | Usuário | **auto-gerar** um labirinto com base nos parâmetros configurados | eu economize tempo na criação |
| US-18 | Usuário | editar um labirinto auto-gerado | eu customize o resultado da geração |

---

## 5. Funcionalidades — Escopo MVP (v1.0)

### 5.1 Core Features

| Feature | Prioridade | Descrição |
|---|---|---|
| **Grid de visualização** | P0 | Área visual quadriculada exibindo o labirinto de acordo com linhas × colunas × tamanho de tile |
| **Configuração de parâmetros** | P0 | Painel abaixo do grid com inputs para linhas, colunas, tile size, entradas e saídas |
| **Edição de células** | P0 | Clique em cada célula para alternar parede/caminho e definir tipo de terreno |
| **Tipos de terreno** | P0 | Cada célula pode ser Pedra ou Areia |
| **Marcação de entrada/saída** | P0 | Marcar células como entrada ou saída, respeitando as quantidades configuradas |
| **Alias do labirinto** | P0 | Campo para nomear o labirinto |
| **Persistência em JSON** | P0 | Armazenamento completo do labirinto como JSON no banco de dados |
| **Listagem de labirintos** | P0 | Tela com lista de todos os labirintos, identificados por alias ou parâmetros |
| **Edição de labirinto existente** | P0 | Carregar labirinto do banco para edição |
| **Exclusão de labirinto** | P0 | Remover labirinto do banco |
| **Auto-geração de labirinto** | P0 | Gerar labirinto automaticamente via algoritmo no servidor |

### 5.2 Infraestrutura (MVP)

| Feature | Prioridade | Descrição |
|---|---|---|
| **NestJS Backend** | P0 | API REST para CRUD de labirintos e auto-geração |
| **PostgreSQL** | P0 | Banco de dados relacional para persistência |

---

## 6. Funcionalidades Futuras (Pós-MVP)

| Feature | Fase | Descrição |
|---|---|---|
| Autenticação de usuário | v2.0 | Login com controle de acesso |
| Níveis de permissão | v2.0 | Roles (admin, editor, viewer) |
| Novos tipos de terreno | v2.0 | Água, Lava, Grama, etc. |
| Exportação de labirinto | v2.0 | Exportar como imagem (PNG/SVG) ou arquivo JSON |
| Algoritmos de pathfinding | v3.0 | Visualizar caminho mínimo entre entrada e saída |
| Multiplayer maze | v3.0 | Vários usuários editando o mesmo labirinto |
| Mobile app (Android) | v3.0 | Versão nativa para dispositivos Android |

---

## 7. Estrutura JSON do Labirinto

> [!IMPORTANT]
> O JSON do labirinto é a estrutura central de dados do sistema. Toda célula do grid é representada individualmente com suas propriedades.

```json
{
  "alias": "Labirinto Exemplo",
  "rows": 10,
  "cols": 10,
  "tileSize": 40,
  "entrances": 1,
  "exits": 1,
  "grid": [
    [
      {
        "row": 0,
        "col": 0,
        "type": "wall",
        "terrain": "stone",
        "role": null
      },
      {
        "row": 0,
        "col": 1,
        "type": "path",
        "terrain": "sand",
        "role": "entrance"
      }
    ],
    [
      {
        "row": 1,
        "col": 0,
        "type": "wall",
        "terrain": "stone",
        "role": null
      },
      {
        "row": 1,
        "col": 1,
        "type": "path",
        "terrain": "sand",
        "role": "entrance"
      }
    ]
  ]
}
```

**Definições por célula:**

| Campo | Tipo | Valores | Descrição |
|---|---|---|---|
| `row` | number | 0..N | Índice da linha |
| `col` | number | 0..N | Índice da coluna |
| `type` | string | `"wall"`, `"path"` | Se a célula é parede ou caminho |
| `terrain` | string | `"stone"`, `"sand"` | Tipo de terreno da célula |
| `role` | string \| null | `"entrance"`, `"exit"`, `null` | Papel especial da célula |

---

## 8. Restrições e Decisões de Negócio

### 8.1 Sem Autenticação (MVP)

> [!IMPORTANT]
> A primeira versão não terá sistema de autenticação. Qualquer pessoa com acesso ao painel pode criar, editar e excluir labirintos. Autenticação e permissões serão implementados na v2.0.

### 8.2 Auto-Geração no Servidor

> [!IMPORTANT]
> A auto-geração de labirintos será processada no backend (NestJS). O algoritmo receberá os parâmetros (linhas, colunas, entradas, saídas) e retornará o grid completo em JSON. O algoritmo padrão será baseado em **Recursive Backtracking** ou **Hunt-and-Kill**, garantindo labirintos com caminho solvável.

### 8.3 Validações

- O número de **entradas** deve ser ≥ 1.
- O número de **saídas** deve ser ≥ 1.
- Entradas e saídas devem estar na **borda** do grid (primeira/última linha ou coluna).
- Entradas e saídas devem ser do tipo **caminho** (path).
- Não pode haver mais entradas ou saídas do que células de borda disponíveis.

### 8.4 Frontend Sem Framework

> [!NOTE]
> O frontend será construído com **HTML, CSS e JavaScript puros**, sem uso de frameworks (React, Vue, Angular). CSS Modules podem ser usados se houver necessidade de organização de estilos. O objetivo é manter o painel simples, leve e sem dependências pesadas.

---

## 9. Compatibilidade

| Requisito | Valor |
|---|---|
| **Plataforma** | Web (browser) |
| **Navegadores** | Chrome 90+, Edge 90+, Firefox 100+, Safari 15+ |
| **Dispositivos** | Desktop (principal), tablet (secundário) |
| **Responsividade** | Desktop-first, com adaptação básica para tablets |

---

## 10. Design & UX

### 10.1 Identidade Visual

- **Paleta**: Tema escuro com acentos vibrantes.
  - Background principal: `#1a1a2e` (dark navy)
  - Background secundário: `#16213e` (darker navy)
  - Superfície: `#0f3460` (deep blue)
  - Accent primário: `#e94560` (vibrant red/coral)
  - Accent secundário: `#533483` (purple)
  - Texto principal: `#eaeaea`
  - Texto secundário: `#a0a0b0`
  - Parede (wall): `#2c3e50` (dark stone gray)
  - Caminho (path): `#ecf0f1` (light)
  - Entrada: `#2ecc71` (green)
  - Saída: `#e74c3c` (red)
  - Pedra: `#7f8c8d` (stone gray)
  - Areia: `#f39c12` (sandy/amber)
- **Tipografia**: Inter ou Roboto (Google Fonts via CDN).
- **Estilo**: Dark mode, minimalista, funcional.

### 10.2 Princípios de UX

1. **Simplicidade**: O grid deve ser o foco principal da tela. Configurações abaixo, discretas.
2. **Feedback visual**: Cada célula deve reagir ao hover e ao clique com transição visual clara.
3. **Clareza**: Cores distintas para parede, caminho, entrada, saída e tipos de terreno.
4. **Eficiência**: Poucos cliques para criar e salvar um labirinto.

### 10.3 Telas do Painel

1. **Editor de Labirinto (Home)**: Grid interativo + painel de configurações abaixo.
2. **Lista de Labirintos**: Lista/cards de labirintos criados, com identificação por alias ou parâmetros.

---

## 11. Requisitos Não-Funcionais

| Requisito | Especificação |
|---|---|
| **Performance** | Grid renderiza em < 500ms para labirintos de até 50×50. |
| **Armazenamento** | JSON do labirinto persiste no PostgreSQL via API NestJS. |
| **Segurança** | Sem autenticação no MVP. API aberta, com rate limiting básico. |
| **Escalabilidade** | Suportar até 1000 labirintos armazenados sem degradação perceptível. |

---

## 12. Glossário

| Termo | Definição |
|---|---|
| **Tile** | Unidade quadrada que compõe o grid do labirinto. |
| **Grid** | Quadriculado formado por linhas × colunas de tiles. |
| **Parede (Wall)** | Tile intransponível no labirinto. |
| **Caminho (Path)** | Tile transitável no labirinto. |
| **Terreno** | Tipo de superfície do tile (Pedra, Areia). |
| **Entrada (Entrance)** | Tile na borda do grid marcado como ponto de início. |
| **Saída (Exit)** | Tile na borda do grid marcado como ponto de término. |
| **Alias** | Nome amigável dado ao labirinto para identificação. |
| **Auto-geração** | Criação automática de um labirinto por algoritmo do servidor. |
| **P0/P1/P2** | Prioridades: P0 = essencial para MVP, P1 = importante, P2 = desejável. |
