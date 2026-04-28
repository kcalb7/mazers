import { loadGrid } from './grid.js';
import { setConfig } from './editor.js';

let currentPage = 1;
const limit = 10;

export async function loadMazesList() {
    const listContainer = document.getElementById('mazes-list');
    listContainer.innerHTML = '<div class="empty-state">Carregando...</div>';

    try {
        const response = await fetch(`http://localhost:3000/mazes?page=${currentPage}&limit=${limit}`);
        if (!response.ok) throw new Error('Erro ao listar labirintos');

        const { data, meta } = await response.json();

        if (data.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">Nenhum labirinto salvo ainda.</div>';
            return;
        }

        listContainer.innerHTML = '';
        data.forEach(maze => {
            const card = document.createElement('div');
            card.className = 'maze-card';
            
            const date = new Date(maze.createdAt).toLocaleDateString();

            card.innerHTML = `
                <div class="maze-card-title">${maze.alias || 'Sem nome'}</div>
                <div class="maze-card-info">
                    <span>${maze.rows}x${maze.cols}</span>
                    <span>${date}</span>
                </div>
                <div class="maze-card-actions">
                    <button class="btn btn-primary load-btn" data-id="${maze.id}">Carregar</button>
                    <button class="btn delete-btn" style="color: var(--accent-primary);" data-id="${maze.id}">Excluir</button>
                </div>
            `;
            listContainer.appendChild(card);
        });

        // Paginação (prev/next) simples no final
        const pagination = document.createElement('div');
        pagination.className = 'actions-group';
        pagination.style.gridColumn = '1 / -1';
        pagination.style.justifyContent = 'center';
        pagination.style.marginTop = 'var(--spacing-lg)';
        
        pagination.innerHTML = `
            <button class="btn" id="btn-prev" ${meta.page <= 1 ? 'disabled' : ''}>Anterior</button>
            <span style="align-self: center;">Página ${meta.page} de ${meta.lastPage || 1}</span>
            <button class="btn" id="btn-next" ${meta.page >= meta.lastPage ? 'disabled' : ''}>Próxima</button>
        `;
        listContainer.appendChild(pagination);

        setupCardEvents();

        document.getElementById('btn-prev').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadMazesList();
            }
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            if (currentPage < meta.lastPage) {
                currentPage++;
                loadMazesList();
            }
        });

    } catch (error) {
        listContainer.innerHTML = `<div class="empty-state" style="color: var(--accent-primary);">${error.message}</div>`;
    }
}

function setupCardEvents() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir?')) {
                try {
                    const response = await fetch(`http://localhost:3000/mazes/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Erro ao excluir');
                    loadMazesList();
                } catch (error) {
                    alert(error.message);
                }
            }
        });
    });

    document.querySelectorAll('.load-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            try {
                const response = await fetch(`http://localhost:3000/mazes/${id}`);
                if (!response.ok) throw new Error('Erro ao carregar dados do labirinto');
                
                const maze = await response.json();
                
                // Mudar para a aba de editor
                document.getElementById('nav-editor').click();
                
                setConfig(maze.entrances, maze.exits);
                loadGrid(maze.grid, maze.tileSize);
                
                // Popula os inputs para corresponder
                document.getElementById('inp-rows').value = maze.rows;
                document.getElementById('inp-cols').value = maze.cols;
                document.getElementById('inp-tile').value = maze.tileSize;
                document.getElementById('inp-entrances').value = maze.entrances;
                document.getElementById('inp-exits').value = maze.exits;

            } catch (error) {
                alert(error.message);
            }
        });
    });
}
