// public/js/news.js
import Paginator from '../modules/paginator/index.js';
import { showLoading, hideLoading } from '../modules/loader/index.js';

const images = [
  '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACi0lEQVR4nO2ZsU8UURCHV0ULlBhjZaGSiKU29CRqAMXCoKKJVnbGf8BGE4IJEkMjhTY2xkJRG9QzRG3sCI0XowF7O0EQRcDiPjPhkWyx9+693dndd8n9kpdcsTu/+W53Z+fNRlFLLYUtYA8wAIwBr4F54Cfwzyz5PQe8Au4CZ+ScKAQB20xCz4F1/LUGTAKnJVZUEsQQ8Bk9VYHzRQIcBT6Qn94BXXlDXACWyV8rwJW8noVhiteY2rNjIB5Snh6owJhSWbbuZIW4TDi6mqU6/VZKQt4Xj0zJlrj7gb3APqATOAaMN4jxCziSBkSrxL4HDjj4XXOINe0LcVEJogK0OXq6gIgGfaqUxht7QW4hjz/PFeSTUxUzvZOGRl0hPEFE/S4BpQHU0HGLRzcwYby21qxH7KeNIDpSdrFJFWaHBWIjY/y/QLsNRPYTGqpaPB4refTZQKS30dBHi8f33J9BNnd2GnprqYiyW9TQlA3km5JJpU78Xehpzgay2EQgP2wgWatJkSDr2iCDpvmLr7rTkYRjt9Y9T98NG8hSCpDeSEHAM0/fBVuw+RJBpIfy0VdbsEoZIMB2YFWz/I6WBHJYdfsLnE0R8Ibpn+Kry/JC7E5Y11P49ttA2oE/hF9+V4HdjS7ziyYAmbRCGLO+JgA55QIi9/GXgEGqDSFihucCBhlwBlEYB+UFMu0FYUw7zVQ8FJBl4JA3iDGWhrAWAEgNuJQKImY+EgDIcCaIWAL3SwQZV4GIJXHT4zbTAKmpXYk6n96WCgBZdJ7xZuxU3+QIMgUczBUioVOeVQSZkblzYQAJyfUAT8yY1BdkxUwee6JQxGaSJ4FbUhjqHLMTeAncBk7IOcVn2lJLkY/+A1tlbk1c+pFNAAAAAElFTkSuQmCC">',
  '<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACpElEQVR4nO2ZW4hOURTHf8aMkfv1gUGTeDEpIRopKaVcH5Dk8sK8iNJQEi+8kJQiIeLJizJ5ECFCXgghk5REMchlXHMdoz2tr7Yv8511ztn7fJvOr3Z9nbPPWvt/9jp777U+yMnJyflf6AKcBtoj2i9glgf/Ky0fl4HqNMZqgLcKMc+AAe40MBP4IbbvA/1dGF2uEGLaMRfOgDrgndh8BYzCIceVYhan9DMEeCK2vgD1OGYQ8FwhpBUYltBHL+CW9d0twRNzlbNyVhaKOHQFTlo2NuCZI0oxDTHt7rWePUQG9AEeK4R8ivGRNlrPnQEqyYipQJtCzFUJmVLMAX5K/3tAXzJmtzLE1pewMUFmrrAPDacMVMsbjBLyFRj7l+drgRfS5yMwjjIyHviuEGOW1G5F39lduWfCah4BsFUZYtukfxVw3rq+hkCoBK4rhJhz02TggHVtF4ExRo4TUWI+WL+bgAoCpFEZYqbdAHoSKBXAJaWQhQROLfBeIeSpq/zCJ6uUs3KUf4AmpZgFBM5Q4JtCyEtgMAGzI8YKZnKQIGmwBvlZKWYFgTHdCqmHko8U8u9SzRQaRhDQ7t4qA3sNjJbrMyT/jhJzIUF67JziyseUovv7lCG2ljLSA7gmAzFvfmknfR4ohJiXYGpaZTmW2JWPjSX61lspbdQ5rIqM2WMN4LCi/3ZliG0hQ9ZZji8WZYCdYfrcVuYuEzPQwGwrTJqBfjGerVPmLs1Ad48a/qh8tCRc/zcpQ2wnnqiRI3hh156UYpG4ohDSBkxzrKGj8nHHcjA/pb2RUgaKEvMI6O1IQ8dyeM7DxrVaGWIHHfljv2XUVBiz/muvXRaYVGy2jJ1S1HKT5C5vFEJagIFJnSyyDnw3PVY+liln5YQn/zk5OTlkz2+ked7zP57ghQAAAABJRU5ErkJggg==">',
  '<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADKklEQVR4nO2aTWxNQRTHfxQtKUoUC6HxsSA2EgtrQYOKRoTSjZ34qNKljaQrXwuNRImkCwsaYuH5ShcICxGxsdHPSCkRaSMRi6piZJIjeXmZuW/m3tt5N03/yUle8u793/N/c+bMOec+mMLkxQKgHrgAPAR6gG/AmJj+3C3f6Wt2A1VkBOVAI9AF/AaUp+l7HgMHhSs4ZgMtwOcYztvsE3ASqAglYjswkKKAQusHaidSgF76tgkUUGg3ZOVTxRLgTUARSuw1sDgtETWy3KpE1ic+JEK1pFFVYhsAlsYVUVGicFIRYRYrRbdnwHlVYJfjpFiVUdvmKkIvX28GHFYW63c9NFscCX8BJ4A5wHRgK/AnkJhml9VwLTsOG+7PBRIyVGzjNzoSPbfcXxswxA5ECelyJNlvuX9awP31KKqfcC3FV0f8GM2BhIwD80wO1HuQRMVnlSSCEGJ2mRy46EGgSxcbVgF/Awk5b3LggQfBTouImcDTQCIUcN/kRJ8Hwe2MlDU9JidGPAj0Hlhu4HgWWMiwSciYJ0mngWMtMBpQyE+TkDgO7DHwHC21kC8xiPSsaoWBq62UofUuJtlbYK7hhC+WzgcTzMOUmB74JUq/haanh2WW2u2H4XqdWFbmnTvtMUM7ZxLSmnCZO6ScL8Qy4GZeia9Li82G63RPfhb47vHMc0lLlKhZlD4UTVgjJ/Fey/f517k+r85EMF+yQFIxT4CFxMcij7PMWDSm2RgNWsLHBTscn6H3dOLGysV04Xhd9ogP7jnyN0SR6Pj+kKIYJeF6BdhYRIBuDa46cn4EZhX7RY6lLCTf9Fl1GtggQ4tKGYceAd578DS5LG3NBApJq+ItdxFyKAPOqoh9twVH3MqAw8pil1xFlHn2JSHtlcsG/49NGXBYWV4r6JdNzjiTAadVgfVaWoVIvMxgOFX7ivAZ0IWwa3Ff7OzLgPNKzgnnFGtCh2NreVdeJ5yS4jAtAbrsaErjHxBDBvKvwB3gOLBeWth8zJCpeC5mhzcuVWyDT2othhcygOiU2medwfEoVEpz1ioVbLfwjcqoaURqrZx0dnWGXn8KTBb8A31C/2cT3/wMAAAAAElFTkSuQmCC">',
]

// Función para renderizar el listado de noticias
const renderContent = (items) => {
  let html = '';
  items.forEach(item => {
    // Usar una imagen predeterminada si no hay una imagen proporcionada
    const imageUrl = item.image || '/images/default-news.jpg'; // Reemplaza con la ruta de tu imagen predeterminada

    // Formatear la fecha de publicación
    const formattedDate = new Date(item.insert).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Codificar la URL de la noticia para incluirla en los enlaces de compartir
    const encodedURL = encodeURIComponent(window.location.origin + `/noticias/${item.slug}`);
    const encodedTitle = encodeURIComponent(item.title);

    // URLs de Compartir
    const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
    const twitterShareURL = `https://twitter.com/intent/tweet?url=${encodedURL}&text=${encodedTitle}`;
    const whatsappShareURL = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedURL}`;
    const instagramShareURL = `https://www.instagram.com/`; // Instagram no tiene una URL directa para compartir enlaces

    html += `
      <div class="card">
        <a href="/noticias/${item.slug}" class="card-content w-100">
          <h2 class="card-title">${item.title}</h2>
          <h3 class="card-subtitle">${item.subtitle || ''}</h3>
          <p class="card-author">Por: <strong>${item.author}</strong></p>
          <small class="card-date">Publicado: ${formattedDate}</small>
        </a>
        <hr class="hr"/>
        <!-- Sección de Compartir en Redes Sociales -->
        <div class="share-buttons">
          <span>Compartir en:</span>
          <div class="share-buttons-content">
            <a href="${facebookShareURL}" class="share-btn facebook" target="_blank" title="Compartir en Facebook">
             ${images[0]}
            </a>
            <a href="${twitterShareURL}" class="share-btn twitter" target="_blank" title="Compartir en X">
            ${images[1]}
            </a>
            <a href="${whatsappShareURL}" class="share-btn whatsapp" target="_blank" title="Compartir en WhatsApp">
            ${images[2]}
            </a>
          </div>
        </div>
      </div>
    `;
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

// Función para cerrar el modal
const closeModal = () => {
  const modal = document.getElementById('message-modal');
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = '';
  modal.style.display = 'none';
};

// Agregar event listener para cerrar el modal
document.querySelector('.close').addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera del modal
window.addEventListener('click', (event) => {
  const modal = document.getElementById('message-modal');
  if (event.target == modal) {
    closeModal();
  }
});

// Función para renderizar la paginación
const renderPagination = (totalPages, currentPage, paginatorInstance) => {
  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.add('pagination-button');
    if (i === currentPage) {
      button.classList.add('active');
    }

    button.addEventListener('click', () => {
      paginatorInstance.goToPage(i);
    });

    paginationContainer.appendChild(button);
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
  showLoading();
  try {
      const response = await fetch('/api/news');
      const result = await response.json();
      hideLoading();

      if (result.success) {
          const allData = result.data;
          let filteredData = allData; // Datos filtrados inicialmente iguales a todos los datos

          const paginator = new Paginator({
              dataSource: filteredData,
              renderContent: renderContent,
              renderPagination: renderPagination,
              pageSize: 5,
          });

          paginator.init();

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
      } else {
          console.error('Error al cargar las noticias:', result.error);
      }
  } catch (error) {
      hideLoading();
      console.error('Error al obtener las noticias:', error);
  }
});
