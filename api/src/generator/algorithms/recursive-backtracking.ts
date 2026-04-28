export interface MazeCell {
  x: number;
  y: number;
  type: 'wall' | 'path';
  terrain: 'stone' | 'sand';
  role?: 'entrance' | 'exit' | null;
}

export class RecursiveBacktracking {
  static generate(rows: number, cols: number, entrances: number, exits: number): MazeCell[][] {
    const grid: MazeCell[][] = [];

    // Initialize with walls
    for (let y = 0; y < rows; y++) {
      grid[y] = [];
      for (let x = 0; x < cols; x++) {
        grid[y][x] = { x, y, type: 'wall', terrain: 'stone' };
      }
    }

    // Helper functions
    const inBounds = (nx: number, ny: number) => nx >= 0 && nx < cols && ny >= 0 && ny < rows;

    const dirs = [
      [0, -2], // N
      [0, 2],  // S
      [2, 0],  // E
      [-2, 0]  // W
    ];

    // Build paths starting from top-left logic inside
    // For DFS, we step by 2. This implies grid has intrinsic structure. We can start at (1,1) if rows/cols > 2
    let startX = 1;
    let startY = 1;
    if (cols <= 2) startX = 0;
    if (rows <= 2) startY = 0;

    grid[startY][startX].type = 'path';
    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const cx = current[0];
      const cy = current[1];

      // Shuffle directions
      const shuffledDirs = [...dirs].sort(() => Math.random() - 0.5);
      let carved = false;

      for (const [dx, dy] of shuffledDirs) {
        const nx = cx + dx;
        const ny = cy + dy;

        if (inBounds(nx, ny) && grid[ny][nx].type === 'wall') {
          grid[cy + dy / 2][cx + dx / 2].type = 'path';
          grid[ny][nx].type = 'path';
          stack.push([nx, ny]);
          carved = true;
          break;
        }
      }

      if (!carved) {
        stack.pop();
      }
    }

    // Quick borders entrance/exit allocation (simplistic for Phase 3)
    let assignedEntrances = 0;
    let assignedExits = 0;

    // We do a simple loop over the borders to find valid path connections
    // Left/Top borders preferably entrances
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Find a cell on the boundary connected to a path
        if (x === 0 || y === 0 || x === cols - 1 || y === rows - 1) {
          const adj = [[0,1], [0,-1], [1,0], [-1,0]];
          let isConnected = false;
          for(const [ax, ay] of adj) {
             const px = x+ax; const py = y+ay;
             if(inBounds(px, py) && grid[py][px].type === 'path') {
                isConnected = true;
             }
          }

          if (isConnected && grid[y][x].type === 'wall') {
             if (assignedEntrances < entrances && (x === 0 || y === 0)) {
               grid[y][x].type = 'path';
               grid[y][x].role = 'entrance';
               assignedEntrances++;
             } else if (assignedExits < exits && (x === cols - 1 || y === rows - 1)) {
               grid[y][x].type = 'path';
               grid[y][x].role = 'exit';
               assignedExits++;
             }
          }
        }
      }
    }

    return grid;
  }
}
