const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

hamburgerBtn.addEventListener('click', function() {
  sidebar.classList.toggle('active');
});

// Cerrar el menú al hacer clic fuera de él
mainContent.addEventListener('click', function() {
  if (sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
  }
});
