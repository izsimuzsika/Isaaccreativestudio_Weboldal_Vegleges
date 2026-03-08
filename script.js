document.addEventListener('DOMContentLoaded', function () {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');
    var darkToggle = document.getElementById('dark-toggle');
    var darkIcon = document.getElementById('dark-toggle-icon');
    var backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: scrollBehavior });
    });

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkIcon.textContent = '\u2600';
        darkToggle.setAttribute('aria-pressed', 'true');
    }

    darkToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        var isDark = document.body.classList.contains('dark-mode');
        darkIcon.textContent = isDark ? '\u2600' : '\u263E';
        darkToggle.setAttribute('aria-pressed', isDark);
        localStorage.setItem('darkMode', isDark);
    });

    toggle.addEventListener('click', function () {
        var isOpen = !links.classList.contains('open');
        toggle.classList.toggle('active');
        links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    links.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            toggle.classList.remove('active');
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && links.classList.contains('open')) {
            toggle.classList.remove('active');
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            toggle.focus();
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
                }
            }
        });
    });

    var revealEls = document.querySelectorAll(
        '.section-tag, .about-heading, .about-p, .about-stats, .retro-frame, ' +
        '.services-title, .services-sub, .svc-card, .extras, ' +
        '.portfolio-title, .pf-item, .contact-content'
    );
    revealEls.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });

    document.querySelectorAll('.stat-num').forEach(function (num) {
        var target = parseInt(num.getAttribute('data-target'));
        var counted = false;
        var statBox = num.closest('.stat-box');

        var statObs = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                var startTime = null;
                var duration = prefersReducedMotion ? 0 : 1500;

                function step(ts) {
                    if (!startTime) startTime = ts;
                    var progress = Math.min((ts - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 4);
                    num.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        num.textContent = target;
                        if (statBox) {
                            statBox.classList.add('counted');
                        }
                    }
                }
                requestAnimationFrame(step);
            }
        }, { threshold: 0.5 });

        statObs.observe(num);
    });
});
