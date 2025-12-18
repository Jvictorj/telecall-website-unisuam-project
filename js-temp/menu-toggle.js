document.addEventListener('DOMContentLoaded', () => {
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuIcon = document.querySelector('.icon');

  if (!menuToggleBtn || !mobileMenu) return;

  menuToggleBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('mobile-menu--open');

    // ARIA
    menuToggleBtn.setAttribute('aria-expanded', isOpen);
    mobileMenu.toggleAttribute('hidden', !isOpen);

    // Ícone (opcional)
    if (menuIcon) {
      menuIcon.src = isOpen
        ? 'IMG/Icons/close_FILL0_wght400_GRAD0_opsz48.svg'
        : 'IMG/Icons/menu_FILL0_wght400_GRAD0_opsz48.svg';
    }
  });
});
