// public/js/videos.js
import Paginator from '../modules/paginator/index.js';
import { showLoading, hideLoading } from '../modules/loader/index.js';

// Funciones para extraer IDs de videos

// Función para extraer el ID de videos de YouTube
function getYouTubeVideoID(url) {
    let videoID = null;
    try {
        const urlObj = new URL(url);

        // Caso de youtu.be
        if (urlObj.hostname === 'youtu.be') {
            videoID = urlObj.pathname.slice(1);
        }
        // Casos de youtube.com
        else if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.pathname === '/watch') {
                videoID = urlObj.searchParams.get('v');
            } else if (urlObj.pathname.startsWith('/embed/')) {
                videoID = urlObj.pathname.split('/embed/')[1];
            } else if (urlObj.pathname.startsWith('/v/')) {
                videoID = urlObj.pathname.split('/v/')[1];
            } else if (urlObj.pathname.startsWith('/shorts/')) {
                videoID = urlObj.pathname.split('/shorts/')[1];
            }
        }
    } catch (e) {
        console.error('URL de YouTube inválida:', url);
    }
    return videoID;
}

// Función para extraer el ID de videos de Vimeo
function getVimeoVideoID(url) {
    let videoID = null;
    try {
        const urlObj = new URL(url);

        // Caso de player.vimeo.com
        if (urlObj.hostname === 'player.vimeo.com') {
            const pathParts = urlObj.pathname.split('/');
            videoID = pathParts[pathParts.length - 1];
        }
        // Caso de vimeo.com
        else if (urlObj.hostname === 'vimeo.com') {
            const pathParts = urlObj.pathname.split('/');
            videoID = pathParts[pathParts.length - 1];
        }
    } catch (e) {
        console.error('URL de Vimeo inválida:', url);
    }
    return videoID;
}

// Función para renderizar el contenido paginado
const renderContent = (items) => {
    let html = '';

    if (items.length === 0) {
        html = `<p class="no-results">No se encontraron videos que coincidan con tu búsqueda.</p>`;
    } else {
        items.forEach(item => {
            let videoID;
            let embedUrl;
            let normalUrl;
            let platform; // Para determinar si es YouTube o Vimeo

            if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
                platform = 'youtube';
                videoID = getYouTubeVideoID(item.url);
                if (videoID) {
                    embedUrl = `https://www.youtube.com/embed/${videoID}`;
                    normalUrl = `https://www.youtube.com/watch?v=${videoID}`;
                }
            } else if (item.url.includes('vimeo.com') || item.url.includes('player.vimeo.com')) {
                platform = 'vimeo';
                videoID = getVimeoVideoID(item.url);
                if (videoID) {
                    embedUrl = `https://player.vimeo.com/video/${videoID}`;
                    normalUrl = `https://vimeo.com/${videoID}`;
                }
            } else {
                // Si no es YouTube ni Vimeo, puedes manejarlo según tus necesidades
                console.warn(`URL no reconocida: ${item.url}`);
                return; // Saltar este item
            }

            if (embedUrl && normalUrl) {
                html += `
                 <div class="card" data-url="${embedUrl}" data-type="iframe" data-title="${item.title}">
              <img src="/images/videos/${item.urlImage}" alt="${item.title}" class="card-image" loading="lazy" />
              <div class="card-content">
                <h2 class="card-title">${item.title}</h2>
              </div>
              <div class="card-icons">
                <span class="icon icon-eye" data-url="${embedUrl}" data-type="iframe" data-title="${item.title}" title="Ver en modal">
                  <!-- Usar el SVG de 'icon-eye' desde el archivo 'icons.html' -->
                  <svg><use href="/icons/icons.svg#icon-eye"></use></svg>
                </span>
                <a href="${normalUrl}" target="_blank" class="icon icon-external" title="Ver en nueva ventana">
                  <!-- Usar el SVG de 'icon-external' desde el archivo 'icons.html' -->
                  <svg><use href="/icons/icons.svg#icon-external"></use></svg>
                </a>
              </div>
            </div>`;
               
            } else {
                console.warn(`No se pudo procesar el video con URL: ${item.url}`);
            }
        });
    }

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

// Función para cerrar el modal
const closeModal = () => {
    const modal = document.getElementById('message-modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';  // Limpiar el contenido dinámico al cerrar
    modal.style.display = 'none';
};

// Agregar event listener para cerrar el modal con el botón de cerrar
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
    try {
        const response = await fetch('/api/videos'); // Asegúrate de que esta ruta sea correcta
        const result = await response.json();
        hideLoading(); // Ocultar indicador de carga después de cargar los datos
        return result.data; // Supone que la API devuelve todos los datos en 'data'
    } catch (error) {
        hideLoading();
        console.error('Error al obtener los videos:', error);
        return [];
    }
};

// Función para manejar la búsqueda
const handleSearch = (data, query) => {
    if (!query) return data;
    const lowerCaseQuery = query.toLowerCase();
    return data.filter(item => 
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(lowerCaseQuery)) ||
        (item.author && item.author.toLowerCase().includes(lowerCaseQuery))
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
        pageSize: 9 // Cuántos elementos por página
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
