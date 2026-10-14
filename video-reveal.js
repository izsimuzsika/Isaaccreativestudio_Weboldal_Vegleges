/* One-time scroll reveals, limited to the video page. */
(function () {
    'use strict';

    var page = document.querySelector('.video-page main');
    var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!page || motionPreference.matches || !('IntersectionObserver' in window)) return;

    var targets = page.querySelectorAll([
        '.service-section-head',
        '.video-offer-image',
        '.video-offer-copy',
        '.video-support-copy',
        '.video-support-image',
        '.process-step',
        '.video-contact-inner > *'
    ].join(','));

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.dataset.revealState = 'visible';
            observer.unobserve(entry.target);
        });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (target) {
        // Keep the opening view and any content already passed fully visible.
        if (target.getBoundingClientRect().top < window.innerHeight - 40) {
            target.dataset.revealState = 'visible';
        } else {
            target.dataset.revealState = 'pending';
            observer.observe(target);
        }
    });

    page.addEventListener('focusin', function (event) {
        var target = event.target.closest('[data-reveal-state="pending"]');
        if (!target) return;
        target.dataset.revealState = 'visible';
        observer.unobserve(target);
    });

    function disableMotion(event) {
        if (!event.matches) return;
        observer.disconnect();
        targets.forEach(function (target) {
            target.dataset.revealState = 'visible';
        });
    }

    if (motionPreference.addEventListener) {
        motionPreference.addEventListener('change', disableMotion);
    } else if (motionPreference.addListener) {
        motionPreference.addListener(disableMotion);
    }
})();
