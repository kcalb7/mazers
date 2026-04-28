import { renderGrid, getGridData, loadGrid, highlightPath, clearPathHighlights } from './grid.js';
import { setTool, setTerrain, setConfig, initEditor } from './editor.js';
import { solveMaze } from './pathfinding.js';

export function initControls() {
    initEditor('grid-container', { entrances: 1, exits: 1 });
    renderGrid(10, 10, 40); // default start

    const controlsHtml = `
        <div class="settings-group">
            <div class="form-group">
                <label>Linhas</label>
                <input type="number" id="inp-rows" class="form-control" value="10" min="2" max="100">
            </div>
            <div class="form-group">
                <label>Colunas</label>
                <input type="number" id="inp-cols" class="form-control" value="10" min="2" max="100">
            </div>
            <div class="form-group">
                <label>Tamanho do Tile (px)</label>
                <input type="number" id="inp-tile" class="form-control" value="40" min="10" max="200">
            </div>
            <div class="form-group">
                <label>Max Entradas</label>
                <input type="number" id="inp-entrances" class="form-control" value="1" min="1">
            </div>
            <div class="form-group">
                <label>Max Saídas</label>
                <input type="number" id="inp-exits" class="form-control" value="1" min="1">
            </div>
            <div class="actions-group">
                <button id="btn-apply" class="btn">Aplicar (Reset)</button>
            </div>
        </div>

        <div class="toolbar">
            <div class="tools-group">
                <button class="btn tool-btn active" data-tool="wall"> Parede</button>
                <button class="btn tool-btn" data-tool="path"> Caminho</button>
                <button class="btn tool-btn" data-tool="entrance"> Entrada</button>
                <button class="btn tool-btn" data-tool="exit"> Saída</button>
            </div>
            <div class="tools-group" style="margin-left: 16px;">
                <button class="btn terrain-btn active" data-terrain="stone"> Pedra</button>
                <button class="btn terrain-btn" data-terrain="sand"> Areia</button>
            </div>
        </div>

        <div class="actions-group" style="margin-top: 16px;">
            <button id="btn-solve" class="btn">📍 Calcular Rota Menor (BFS)</button>
            <button id="btn-export" class="btn">💾 Exportar JSON</button>
            <button id="btn-autogenerate" class="btn">🎲 Auto-Gerar (API)</button>
            <button id="btn-save" class="btn btn-primary">Salvar no Banco</button>
        </div>
    `;

    const container = document.getElementById('controls-panel');
    container.innerHTML = controlsHtml;

    setupListeners();
}

function setupListeners() {
    const btnApply = document.getElementById('btn-apply');
    btnApply.addEventListener('click', () => {
        const r = parseInt(document.getElementById('inp-rows').value, 10);
        const c = parseInt(document.getElementById('inp-cols').value, 10);
        const tile = parseInt(document.getElementById('inp-tile').value, 10);
        const e = parseInt(document.getElementById('inp-entrances').value, 10);
        const ex = parseInt(document.getElementById('inp-exits').value, 10);
        setConfig(e, ex);
        renderGrid(r, c, tile);
    });

    // Tool switching
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            setTool(e.currentTarget.dataset.tool);
        });
    });

    document.querySelectorAll('.terrain-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.terrain-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            setTerrain(e.currentTarget.dataset.terrain);
        });
    });

    // Download JSON
    document.getElementById('btn-export').addEventListener('click', () => {
        const grid = getGridData();
        const rows = grid.length;
        const cols = grid[0]?.length || 0;
        
        const payload = {
            rows, cols, entrances: 1, exits: 1, grid
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `maze-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Solve Path
    document.getElementById('btn-solve').addEventListener('click', () => {
        clearPathHighlights();
        const grid = getGridData();
        const path = solveMaze(grid);
        if (path && path.length > 0) {
            highlightPath(path);
        }
    });

    // Generator API Call
    document.getElementById('btn-autogenerate').addEventListener('click', async () => {
        const btn = document.getElementById('btn-autogenerate');
        btn.disabled = true;
        btn.textContent = 'Gerando...';

        try {
            const r = parseInt(document.getElementById('inp-rows').value, 10);
            const c = parseInt(document.getElementById('inp-cols').value, 10);
            const e = parseInt(document.getElementById('inp-entrances').value, 10);
            const ex = parseInt(document.getElementById('inp-exits').value, 10);
            const tile = parseInt(document.getElementById('inp-tile').value, 10);

            const res = await fetch('http://localhost:3000/generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rows: r, cols: c, entrances: e, exits: ex })
            });

            if (!res.ok) throw new Error('Falha ao gerar na API');
            
            const data = await res.json();
            setConfig(e, ex);
            loadGrid(data.grid, tile);

        } catch (error) {
            alert(error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = '🎲 Auto-Gerar (API)';
        }
    });

    // Save to Database
    document.getElementById('btn-save').addEventListener('click', async () => {
        const btn = document.getElementById('btn-save');
        btn.disabled = true;
        btn.textContent = 'Salvando...';

        try {
            const grid = getGridData();
            const r = parseInt(document.getElementById('inp-rows').value, 10);
            const c = parseInt(document.getElementById('inp-cols').value, 10);
            const e = parseInt(document.getElementById('inp-entrances').value, 10);
            const ex = parseInt(document.getElementById('inp-exits').value, 10);
            const tile = parseInt(document.getElementById('inp-tile').value, 10);

            const res = await fetch('http://localhost:3000/mazes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alias: `Maze ${Date.now()}`,
                    rows: r, cols: c, tileSize: tile, entrances: e, exits: ex, grid
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                console.error(errData);
                throw new Error('Falha ao salvar no banco');
            }
            
            alert('Labirinto salvo com sucesso!');

        } catch (error) {
            alert(error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Salvar no Banco';
        }
    });
}
