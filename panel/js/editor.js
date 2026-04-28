import { getGridData, updateCell } from './grid.js';

let currentTool = 'wall'; // wall, path, entrance, exit
let currentTerrain = 'stone'; // stone, sand
let maxEntrances = 1;
let maxExits = 1;
let gridContainer = null;

let isDrawing = false;

export function initEditor(containerId, options = {}) {
    gridContainer = document.getElementById(containerId);
    maxEntrances = options.entrances || 1;
    maxExits = options.exits || 1;

    setupEvents();
}

export function setTool(tool) {
    currentTool = tool;
}

export function setTerrain(terrain) {
    currentTerrain = terrain;
}

export function setConfig(entrances, exits) {
    maxEntrances = entrances;
    maxExits = exits;
}

function setupEvents() {
    gridContainer.addEventListener('mousedown', (e) => {
        isDrawing = true;
        handleCellInteraction(e.target);
    });

    gridContainer.addEventListener('mouseover', (e) => {
        if (isDrawing) {
            handleCellInteraction(e.target);
        }
    });

    document.addEventListener('mouseup', () => {
        isDrawing = false;
    });
}

function handleCellInteraction(element) {
    if (!element.classList.contains('maze-cell')) return;

    const x = parseInt(element.dataset.x, 10);
    const y = parseInt(element.dataset.y, 10);
    const grid = getGridData();
    const cell = grid[y][x];

    const rows = grid.length;
    const cols = grid[0].length;
    const isBorder = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;

    if (currentTool === 'wall' || currentTool === 'path') {
        const type = currentTool;
        // Se for definir caminho, aplica o terreno atual
        updateCell(x, y, { 
            type, 
            terrain: type === 'path' ? currentTerrain : 'stone',
            role: null // reset role if changing type to wall
        });
    } else if (currentTool === 'entrance' || currentTool === 'exit') {
        // Validation: must be border
        if (!isBorder) {
            alert('Entradas e saídas devem estar nas bordas do labirinto.');
            return;
        }

        // Must be path to have a role (or we make it a path automatically)
        const role = currentTool;
        
        // Check limits
        const currentCount = countRoles(role);
        
        if (cell.role !== role && currentCount >= (role === 'entrance' ? maxEntrances : maxExits)) {
            alert(`Você só pode ter no máximo ${role === 'entrance' ? maxEntrances : maxExits} ${role}(s).`);
            return;
        }

        updateCell(x, y, { type: 'path', role });
    }
}

function countRoles(role) {
    const grid = getGridData();
    let count = 0;
    for (const row of grid) {
        for (const cell of row) {
            if (cell.role === role) count++;
        }
    }
    return count;
}
