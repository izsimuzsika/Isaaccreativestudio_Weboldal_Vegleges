/* Scroll-linked depth with cached layout, one scheduled frame, and no dependencies. */
(function () {
    'use strict';

    function init() {
        if (!('IntersectionObserver' in window)) return;

        var root = document.documentElement;
        var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        var selectors = [
            '.hero-title-line', '.hero-badge', '.hero-sub', '.hero-cta', '.hero-tape',
            '.section-tag', '.about-heading', '.about-p', '.stat-box', '.retro-frame',
            '.services-title', '.services-sub', '.svc-card', '.new-service',
            '.extras-title', '.extra-item', '.portfolio-title', '.pf-item',
            '.contact-title', '.contact-sub', '.contact-invoice', '.contact-btn-big',
            '.video-hero-copy h1 .line', '.video-hero-copy .service-intro',
            '.video-hero-offers > a', '.video-hero-contact-link', '.video-hero-visual',
            '.video-service-depth-heading', '.video-service-depth-card',
            '.video-offer-copy', '.video-offer-image',
            '.video-support-copy', '.video-support-image',
            '.video-contact-inner > div:first-child', '.video-contact-button'
        ].join(',');
        var cardSelectors = [
            '.video-service-depth-card', '.svc-card', '.new-service', '.stat-box',
            '.retro-frame', '.pf-item', '.extra-item', '.contact-btn-big',
            '.video-contact-button', '.video-hero-offers > a'
        ].join(',');
        var records = [];
        var lookup = new WeakMap();
        var active = new Set();
        var observer;
        var frame = 0;
        var needsMeasure = true;
        var enabled = false;

        function clamp(value, low, high) {
            return Math.max(low, Math.min(high, value));
        }

        function schedule() {
            if (enabled && !frame && !document.hidden) {
                frame = window.requestAnimationFrame(render);
            }
        }

        function show(record) {
            record.revealed = true;
            record.element.dataset.depthState = 'visible';
        }

        function measure() {
            records.forEach(function (record) {
                // offset geometry excludes this engine's transforms and reveal scale.
                if (record.fixedContact) {
                    // This overlay is intentionally centered with translateY(-50%).
                    // Include that authored positioning, but not the reveal's own scale.
                    var rect = record.element.getBoundingClientRect();
                    record.height = record.element.offsetHeight;
                    record.top = rect.top + window.scrollY - (record.height - rect.height) / 2;
                    return;
                }
                var node = record.element;
                var top = 0;
                while (node) {
                    top += node.offsetTop;
                    node = node.offsetParent;
                }
                record.top = top;
                record.height = record.element.offsetHeight;
            });
            needsMeasure = false;
        }

        function render() {
            frame = 0;
            if (!enabled || document.hidden) return;
            if (needsMeasure) measure();
            var height = window.innerHeight;
            var scroll = window.scrollY;
            var touch = !finePointer.matches;

            active.forEach(function (record) {
                var progress = clamp(
                    (record.top + record.height / 2 - scroll - height / 2) /
                    (height / 2 + record.height / 2), -1, 1
                );
                if (!record.revealed && record.top - scroll < height - 48) show(record);
                var amplitude = record.subtle ? (touch ? 8 : 12) : (record.fixedContact ? 0 : (touch ? 40 : 76));
                var pitch = record.subtle ? 2 : (record.fixedContact ? (record.card ? 4 : 0) : (touch ? 10 : 17));
                var x = progress * pitch + record.pointerPitch;
                var y = record.pointerYaw;
                var angle = Math.sqrt(x * x + y * y);
                record.element.style.setProperty('--depth-scroll-y', (progress * amplitude).toFixed(2) + 'px');
                record.element.style.setProperty('--depth-rotation',
                    angle < .01 ? 'none' : x.toFixed(3) + ' ' + y.toFixed(3) + ' 0 ' + angle.toFixed(3) + 'deg');
            });
        }

        function start() {
            if (enabled || preference.matches) return;
            enabled = true;
            needsMeasure = true;
            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var record = lookup.get(entry.target);
                    record.element.dataset.depthActive = String(entry.isIntersecting);
                    if (entry.isIntersecting) active.add(record);
                    else active.delete(record);
                });
                schedule();
            }, { rootMargin: '160px 0px', threshold: 0 });
            records.forEach(function (record) {
                if (record.element.getBoundingClientRect().top < window.innerHeight - 48) show(record);
                record.element.dataset.depthState = record.revealed ? 'visible' : 'pending';
                observer.observe(record.element);
            });
            root.classList.add('depth-motion-ready');
            schedule();
        }

        function stop() {
            enabled = false;
            if (frame) window.cancelAnimationFrame(frame);
            frame = 0;
            if (observer) observer.disconnect();
            active.clear();
            root.classList.remove('depth-motion-ready');
            records.forEach(function (record) {
                show(record);
                record.pointerPitch = record.pointerYaw = 0;
                record.element.dataset.depthActive = 'false';
                ['--depth-scroll-y', '--depth-rotation', '--depth-pointer-x', '--depth-pointer-y']
                    .forEach(function (property) { record.element.style.removeProperty(property); });
            });
        }

        document.querySelectorAll(selectors).forEach(function (element) {
            var record = {
                element: element, top: 0, height: 0, revealed: false,
                card: element.matches(cardSelectors), fixedContact: !!element.closest('.contact'),
                subtle: element.dataset.depth === 'subtle',
                pointerPitch: 0, pointerYaw: 0
            };
            element.classList.add('depth-motion-item');
            lookup.set(element, record);
            records.push(record);
            if (!record.card) return;

            element.addEventListener('pointermove', function (event) {
                if (!enabled || !finePointer.matches || event.pointerType === 'touch') return;
                var rect = element.getBoundingClientRect();
                var x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
                var y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
                record.pointerPitch = (0.5 - y) * (record.subtle ? 4 : 18);
                record.pointerYaw = (x - 0.5) * (record.subtle ? 6 : 24);
                element.style.setProperty('--depth-pointer-x', (x * 100).toFixed(1) + '%');
                element.style.setProperty('--depth-pointer-y', (y * 100).toFixed(1) + '%');
                active.add(record);
                schedule();
            }, { passive: true });
            element.addEventListener('pointerleave', function () {
                record.pointerPitch = record.pointerYaw = 0;
                element.style.removeProperty('--depth-pointer-x');
                element.style.removeProperty('--depth-pointer-y');
                schedule();
            });
        });

        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', function () { needsMeasure = true; schedule(); }, { passive: true });
        document.addEventListener('visibilitychange', function () {
            if (document.hidden && frame) {
                window.cancelAnimationFrame(frame);
                frame = 0;
            } else {
                needsMeasure = true;
                schedule();
            }
        });
        document.addEventListener('focusin', function (event) {
            var element = event.target.closest('.depth-motion-item');
            if (!element) return;
            var record = lookup.get(element);
            show(record);
            active.add(record);
            schedule();
        });
        var preferenceChanged = function () {
            if (preference.matches) stop();
            else start();
        };
        if (preference.addEventListener) preference.addEventListener('change', preferenceChanged);
        else preference.addListener(preferenceChanged);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () { needsMeasure = true; schedule(); });
        }
        if ('ResizeObserver' in window) {
            new ResizeObserver(function () { needsMeasure = true; schedule(); }).observe(document.body);
        }
        start();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
