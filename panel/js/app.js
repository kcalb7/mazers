// Entry point
import { initControls } from './controls.js';

document.addEventListener('DOMContentLoaded', () => {
    initControls();

    const navEditor = document.getElementById('nav-editor');
    const navList = document.getElementById('nav-list');
    const viewEditor = document.getElementById('view-editor');
    const viewList = document.getElementById('view-list');

    navEditor.addEventListener('click', () => {
        navEditor.classList.add('active');
        navList.classList.remove('active');
        viewEditor.style.display = 'flex';
        viewList.style.display = 'none';
    });

    navList.addEventListener('click', () => {
        navList.classList.add('active');
        navEditor.classList.remove('active');
        viewList.style.display = 'flex';
        viewEditor.style.display = 'none';
    });
});
