import Paginator from '../modules/paginator/index.js';
import  { showLoading, hideLoading } from '../modules/loader/index.js';

// Función para renderizar el contenido paginado
const renderContent = (items) => {
    let html = '';
    items.forEach(item => {
        html += `
        <a href="${item.url}" target="_blank" class="card">
          <img src="/images/gallery/${item.urlImage}" alt="${item.title}" class="card-image" loading="lazy"/>
          <div class="card-content">
            <h2 class="card-title">${item.title}</h2>
          </div>
        </a>`;
    });
    document.getElementById('data-container').innerHTML = html;
};


// Función para renderizar los botones de paginación
const renderPagination = (totalPages, currentPage, paginatorInstance) => {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Limpiar botones anteriores

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        if (i === currentPage) {
            button.classList.add('active');
        }

        // Evento para cambiar de página
        button.addEventListener('click', () => {
            paginatorInstance.goToPage(i);
        });

        paginationContainer.appendChild(button);
    }
};

// Función para obtener todos los datos del servidor (de una sola vez)
const fetchAllData = async () => {
    showLoading(); // Mostrar indicador de carga
    const response = await fetch('/api/gallery'); // Un solo request para todos los datos
    const result = await response.json();
    hideLoading(); // Ocultar indicador de carga después de cargar los datos
    return result.data; // Supone que la API devuelve todos los datos en 'data'
};

// Inicializar la paginación al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchAllData(); // Cargar todos los datos desde la API
    const paginator = new Paginator({
        dataSource: data, // Aquí usamos todo el conjunto de datos
        renderContent: renderContent,
        renderPagination: renderPagination,
        pageSize: 8 // Cuántos elementos por página
    });

    paginator.init(); // Inicializar paginación con todos los datos
});