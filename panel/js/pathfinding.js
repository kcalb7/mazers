export function solveMaze(gridData) {
    if (!gridData || gridData.length === 0) return [];
    
    // Encontrar uma entrada e uma saída
    let start = null;
    let end = null;
    
    const rows = gridData.length;
    const cols = gridData[0].length;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (gridData[y][x].role === 'entrance' && !start) start = [x, y];
            if (gridData[y][x].role === 'exit' && !end) end = [x, y];
        }
    }

    if (!start || !end) {
        alert('Labirinto precisa de pelo menos uma entrada e uma saída.');
        return [];
    }

    // BFS Queue: guarda array das coordenadas [x, y]
    const queue = [[start]];
    const visited = new Set();
    visited.add(`${start[0]},${start[1]}`);

    const inBounds = (x, y) => x >= 0 && x < cols && y >= 0 && y < rows;
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (queue.length > 0) {
        const path = queue.shift();
        const current = path[path.length - 1];
        const cx = current[0];
        const cy = current[1];

        // Se chegou no end
        if (cx === end[0] && cy === end[1]) {
            return path;
        }

        for (const [dx, dy] of dirs) {
            const nx = cx + dx;
            const ny = cy + dy;

            if (inBounds(nx, ny) && !visited.has(`${nx},${ny}`)) {
                if (gridData[ny][nx].type === 'path') {
                    visited.add(`${nx},${ny}`);
                    queue.push([...path, [nx, ny]]);
                }
            }
        }
    }

    alert('Não há caminho possível entre a entrada e a saída!');
    return [];
}
