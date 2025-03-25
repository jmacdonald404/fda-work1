const bannerEvent = document.getElementById('banner_event');
bannerEvent.addEventListener('click', function(e) {
  e.stopImmediatePropagation();
  e.preventDefault();
  $('#bannerModal').modal('show');
  $('.modal-backdrop.show').attr('style', 'opacity: 0.95 !important; background-color: rgba(45, 57, 88, 0.85) !important;');
});