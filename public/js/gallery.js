// public/js/gallery.js
import Paginator from '../modules/paginator/index.js';
import { showLoading, hideLoading } from '../modules/loader/index.js';

// Función para renderizar el contenido paginado
const renderContent = (items) => {
    let html = '';

    if (items.length === 0) {
        html = `<p class="no-results">No se encontraron áreas comunes que coincidan con tu búsqueda.</p>`;
    } else {
        items.forEach(item => {
            html += `
                <a href="${item.url}" target="_blank" class="card">
                    <img src="/images/gallery/${item.urlImage}" alt="${item.title}" class="card-image" loading="lazy"/>
                    <div class="card-content">
                        <h2 class="card-title">${item.title}</h2>
                    </div>
                </a>`;
        });
    }

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
    try {
        const response = await fetch('/api/gallery'); // Asegúrate de que esta ruta sea correcta
        const result = await response.json();
        hideLoading(); // Ocultar indicador de carga después de cargar los datos
        return result.data; // Supone que la API devuelve todos los datos en 'data'
    } catch (error) {
        hideLoading();
        console.error('Error al obtener los datos de la galería:', error);
        return [];
    }
};

// Función para manejar la búsqueda
const handleSearch = (data, query) => {
    if (!query) return data;
    const lowerCaseQuery = query.toLowerCase();
    return data.filter(item => 
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        (item.edition && item.edition.toLowerCase().includes(lowerCaseQuery)) ||
        (item.author && item.author.toLowerCase().includes(lowerCaseQuery)) // Añade más campos si es necesario
    );
};

// Función de debounce
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    }
}

// Inicializar la paginación al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const allData = await fetchAllData(); // Cargar todos los datos desde la API
    let filteredData = allData; // Datos filtrados inicialmente iguales a todos los datos

    const paginator = new Paginator({
        dataSource: filteredData, // Aquí usamos los datos filtrados
        renderContent: renderContent,
        renderPagination: renderPagination,
        pageSize: 8 // Cuántos elementos por página
    });

    paginator.init(); // Inicializar paginación con los datos filtrados

    // Manejar evento de búsqueda
    const searchInput = document.getElementById('search-input');

    const performSearch = () => {
        const query = searchInput.value.trim();
        filteredData = handleSearch(allData, query);
        paginator.updateData(filteredData);
    };

    // Evento al presionar 'Enter' en el input de búsqueda
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Búsqueda en tiempo real con debounce
    searchInput.addEventListener('input', debounce(() => {
        performSearch();
    }, 300)); // Espera 300ms después de que el usuario deja de escribir
});
