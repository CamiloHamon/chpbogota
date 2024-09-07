// Función para mostrar el indicador de carga
export const showLoading = (selector = '#loading-indicator') => {
    const loadingElement = document.querySelector(selector);
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
};

// Función para ocultar el indicador de carga
export const hideLoading = (selector = '#loading-indicator') => {
    const loadingElement = document.querySelector(selector);
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
};
