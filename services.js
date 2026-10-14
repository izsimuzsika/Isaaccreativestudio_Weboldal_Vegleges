document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-current-year]').forEach(function (year) {
        year.textContent = new Date().getFullYear();
    });

    var menuButton = document.querySelector('.service-menu');
    var menu = menuButton && document.getElementById(menuButton.getAttribute('aria-controls'));

    if (!menuButton || !menu) return;

    function closeMenu(returnFocus) {
        menu.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Navigáció megnyitása');
        if (returnFocus) menuButton.focus();
    }

    menuButton.addEventListener('click', function () {
        var isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
        menu.classList.toggle('is-open', isOpen);
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Navigáció bezárása' : 'Navigáció megnyitása');
    });

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { closeMenu(false); });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 1100) closeMenu(false);
    });
});
