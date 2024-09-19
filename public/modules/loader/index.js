// Función para mostrar el indicador de carga
export const showLoading = (selector = '#loading-indicator', btnSelector = '#btn-text') => {
    const loadingElement = document.querySelector(selector);
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    const buttonText = document.querySelector(btnSelector);
    if (buttonText) {
        buttonText.style.display = 'none';
        loadingElement.style.position = 'initial';
        loadingElement.style.width = '18px';
        loadingElement.style.height = '18px';
        loadingElement.style.border = '3px solid #f3f3f3';
        loadingElement.style.borderTop = '3px solid #8B1D42';

    }
};

// Función para ocultar el indicador de carga
export const hideLoading = (selector = '#loading-indicator',  btnSelector = '#btn-text') => {
    const loadingElement = document.querySelector(selector);
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    const buttonText = document.querySelector(btnSelector);
    if (buttonText) {
        buttonText.style.display = 'block';
        loadingElement.style.position = 'absolute';
        loadingElement.style.width = '30px';
        loadingElement.style.height = '30px';
        loadingElement.style.border = '5px solid #f3f3f3';
        loadingElement.style.borderTop = '5px solid #8B1D42';
    }
};
