(function () {
  const modalTrigger = document.getElementById('modal-trigger');
  const modalContainer = document.getElementById('modal-container');
  const modalClose = document.getElementById('modal-close');

  function toggleModal() {
    if (modalContainer.classList.contains('open')) {
      modalContainer.classList.remove('open');
    } else {
      modalContainer.classList.add('open');
    }
  }

  modalTrigger.addEventListener('click', () => {
    toggleModal();
  });

  modalClose.addEventListener('click', () => {
    toggleModal();
  });
})();
