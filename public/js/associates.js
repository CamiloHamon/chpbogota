document.addEventListener('DOMContentLoaded', function () {
    new Glider(document.querySelector('.glider'), {
      slidesToShow: 4,
      slidesToScroll: 1,
      draggable: false,
      dots: '.dots',
      arrows: {
        prev: '.glider-prev',
        next: '.glider-next'
      }
    });
  });
  