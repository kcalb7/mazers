let gridData = [];
let gridContainer = null;

export function initGrid(containerId) {
    gridContainer = document.getElementById(containerId);
}

export function renderGrid(rows, cols, tileSize) {
    if (!gridContainer) return;
    
    // Clear existing
    gridContainer.innerHTML = '';
    gridData = [];

    // Setup CSS grid format
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateRows = `repeat(${rows}, ${tileSize}px)`;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${tileSize}px)`;
    gridContainer.style.width = 'max-content';

    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            const cellState = { x, y, type: 'wall', terrain: 'stone', role: null };
            row.push(cellState);

            const cellElement = document.createElement('div');
            cellElement.classList.add('maze-cell');
            cellElement.dataset.x = x;
            cellElement.dataset.y = y;
            cellElement.dataset.type = 'wall';
            cellElement.dataset.terrain = 'stone';
            
            gridContainer.appendChild(cellElement);
        }
        gridData.push(row);
    }
}

export function updateCell(x, y, cellData) {
    if (gridData[y] && gridData[y][x]) {
        gridData[y][x] = { ...gridData[y][x], ...cellData };
        
        // Find DOM element and update
        const cellElement = gridContainer.querySelector(`.maze-cell[data-x="${x}"][data-y="${y}"]`);
        if (cellElement) {
            if (cellData.type) cellElement.dataset.type = cellData.type;
            if (cellData.terrain) cellElement.dataset.terrain = cellData.terrain;
            if (cellData.role !== undefined) {
                if (cellData.role === null) {
                    delete cellElement.dataset.role;
                } else {
                    cellElement.dataset.role = cellData.role;
                }
            }
        }
    }
}

export function getGridData() {
    return gridData;
}

export function loadGrid(newGridData, tileSize = 40) {
    if (!newGridData || newGridData.length === 0) return;
    const rows = newGridData.length;
    const cols = newGridData[0].length;
    
    renderGrid(rows, cols, tileSize);
    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            updateCell(x, y, newGridData[y][x]);
        }
    }
}

export function clearPathHighlights() {
    if (!gridContainer) return;
    const cells = gridContainer.querySelectorAll('.maze-cell.route-path');
    cells.forEach(cell => cell.classList.remove('route-path'));
}

export function highlightPath(pathCoords) {
    clearPathHighlights();
    pathCoords.forEach(([x, y]) => {
        const cellElement = gridContainer.querySelector(`.maze-cell[data-x="${x}"][data-y="${y}"]`);
        if (cellElement) {
            cellElement.classList.add('route-path');
        }
    });
}
