// Función para cambiar el estilo del header al hacer scroll
window.onscroll = function () {
    const $header = document.getElementById('main-header');
    const $containerHeader = document.querySelector('.container-header');
    const $active = document.querySelector('#main-header nav ul li a.active');
    const $dropdownMenu = document.querySelector('#main-header nav ul.dropdown-menu');

    if (window.scrollY > 50) {
        $header.classList.add('scroll-header');
        if ($active) $active.classList.add('scroll-header');
        $containerHeader.style.height = '60px'; // Muestra la barra amarilla
        $dropdownMenu.style.top = '75px'
    } else {
        $header.classList.remove('scroll-header');
        if ($active) $active.classList.remove('scroll-header');
        $containerHeader.style.height = 'auto'; // Oculta la barra amarilla cuando está en la parte superior
        $dropdownMenu.style.top = '100%'

    }
};

// layout.js

document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainMenu = document.getElementById('main-menu');

    // Toggle del menú principal
    hamburgerBtn.addEventListener('click', function () {
        mainMenu.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = mainMenu.contains(event.target);
        const isClickOnHamburger = hamburgerBtn.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHamburger) {
            mainMenu.classList.remove('active');
            // Cerrar dropdowns abiertos
            const openDropdowns = document.querySelectorAll('.dropdown.active');
            openDropdowns.forEach(function (dropdown) {
                dropdown.classList.remove('active');
            });
        }
    });

    // Manejo del dropdown en dispositivos móviles
    const dropdown = document.querySelector('.dropdown');
    const dropdownBtn = dropdown.querySelector('.dropdown-btn');

    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', function (event) {
            event.preventDefault();
            dropdown.classList.toggle('active');
        });
    }

});

