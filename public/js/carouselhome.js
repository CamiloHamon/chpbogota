document.addEventListener('DOMContentLoaded', function () {
  new Glider(document.querySelector('.glider'), {
    slidesToShow: 3,
    dots: '#dots',
    arrows: {
      prev: '.glider-prev',  // Selector para la flecha izquierda
      next: '.glider-next'   // Selector para la flecha derecha
    }
  });
});
