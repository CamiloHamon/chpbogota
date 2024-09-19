import Paginator from '../modules/paginator/index.js';
import { showLoading, hideLoading } from '../modules/loader/index.js';

// Función para renderizar el contenido paginado
const renderContent = (items) => {
    let html = '';
    items.forEach(item => {
        let url = item.url.substring(0, item.url.indexOf('?'));

        // Reemplazar "/embed/" por "watch?v="
        if (url.includes('/embed/')) {
            url = url.replace('/embed/', '/watch?v=');
        }

        if (url.includes('player.vimeo.com/video/')) {
            url = url.replace('player.vimeo.com/video', 'vimeo.com');
        }
        
        html += `
        <div class="card" data-url="${item.url}" data-type="${item.type}" data-title="${item.title}">
          <img src="/images/videos/${item.urlImage}" alt="${item.title}" class="card-image" loading="lazy" />
          <div class="card-content">
            <h2 class="card-title">${item.title}</h2>
          </div>
          <div class="card-icons">
            <span class="icon icon-eye" data-url="${item.url}" data-type="${item.type}" data-title="${item.title}" title="Ver en modal">
              <!-- Usar el SVG de 'icon-eye' desde el archivo 'icons.html' -->
              <svg><use href="/icons/icons.svg#icon-eye"></use></svg>
            </span>
            <a href="${url}" target="_blank" class="icon icon-external" title="Ver en nueva ventana">
              <!-- Usar el SVG de 'icon-external' desde el archivo 'icons.html' -->
              <svg><use href="/icons/icons.svg#icon-external"></use></svg>
            </a>
          </div>
        </div>`;
    });

    document.getElementById('data-container').innerHTML = html;

    // Agregar evento a los íconos de ojo para abrir el modal
    const eyeIcons = document.querySelectorAll('.icon-eye');
    eyeIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que se cierre el modal si haces clic en la tarjeta
            const videoUrl = icon.getAttribute('data-url');
            const contentType = icon.getAttribute('data-type');
            const title = icon.getAttribute('data-title');
            openModal(videoUrl, contentType, title);
        });
    });
};

// Función para abrir el modal con contenido dinámico
const openModal = (content, type, title = "Contenido dinámico") => {
    const modal = document.getElementById('message-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');

    // Limpiar el contenido anterior del modal
    modalBody.innerHTML = '';
    modalTitle.textContent = title; // Modificar el título dinámicamente

    // Dependiendo del tipo, renderizamos el contenido
    if (type === 'video') {
        modalBody.innerHTML = `<video src="${content}" controls class="video-frame"></video>`;
    } else if (type === 'texto') {
        modalBody.innerHTML = `<p>${content}</p>`;
    } else if (type === 'imagen') {
        modalBody.innerHTML = `<img src="${content}" alt="Contenido dinámico" class="image-content" loading="lazy">`;
    } else if (type === 'iframe') {
        modalBody.innerHTML = `<iframe src="${content}" frameborder="0" allowfullscreen class="video-frame"></iframe>`;
    }

    // Mostrar el modal
    modal.style.display = 'flex';
};

// Cerrar el modal
const closeModal = () => {
    const modal = document.getElementById('message-modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';  // Limpiar el contenido dinámico al cerrar
    modal.style.display = 'none';
};

// Agregar event listener para cerrar el modal con el botón de cerrar
document.querySelector('.close').addEventListener('click', closeModal);

// Cerrar modal al hacer clic en el botón de cerrar
document.querySelector('.close').addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera del modal
window.addEventListener('click', (event) => {
    const modal = document.getElementById('message-modal');
    if (event.target == modal) {
        closeModal();
    }
});


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
    const response = await fetch('/api/videos'); // Un solo request para todos los datos
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
        pageSize: 9// Cuántos elementos por página
    });

    paginator.init(); // Inicializar paginación con todos los datos
});