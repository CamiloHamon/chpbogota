// Función para cambiar el estilo del header al hacer scroll
window.onscroll = function() {
    const $header = document.getElementById('main-header');
    const $containerHeader = document.querySelector('.container-header');
    const $active = document.querySelector('#main-header nav ul li a.active');
    const $dropdownMenu = document.querySelector('#main-header nav ul.dropdown-menu');
    
    if (window.scrollY > 50) {
        $header.classList.add('scroll-header');
        $active.classList.add('scroll-header');
        $containerHeader.style.height = '60px'; // Muestra la barra amarilla
        $dropdownMenu.style.top = '75px'
    } else {
        $header.classList.remove('scroll-header');
        $active.classList.remove('scroll-header');
        $containerHeader.style.height = 'auto'; // Oculta la barra amarilla cuando está en la parte superior
        $dropdownMenu.style.top = '100%'

    }
};
