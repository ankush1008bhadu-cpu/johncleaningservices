/* ============================================================
   before-after.js — Drag/touch before-after image slider
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.ba-slider-wrap');

    sliders.forEach(wrap => {
        const after = wrap.querySelector('.ba-after');
        const handle = wrap.querySelector('.ba-handle');
        let dragging = false;

        function setPosition(x) {
            const rect = wrap.getBoundingClientRect();
            let pct = ((x - rect.left) / rect.width) * 100;
            pct = Math.max(2, Math.min(98, pct));
            after.style.width = `${100 - pct}%`;
            handle.style.left = `${pct}%`;
        }

        // Mouse
        handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
        window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
        window.addEventListener('mouseup', () => { dragging = false; });
        wrap.addEventListener('click', e => setPosition(e.clientX));

        // Touch
        handle.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive: false });
        window.addEventListener('touchmove', e => {
            if (dragging && e.touches[0]) setPosition(e.touches[0].clientX);
        }, { passive: true });
        window.addEventListener('touchend', () => { dragging = false; });

        // Animate in on first view
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                let pos = 50, dir = -1, frames = 0;
                const intro = setInterval(() => {
                    pos += dir * 0.8;
                    setPosition(wrap.getBoundingClientRect().left + wrap.offsetWidth * (pos / 100));
                    frames++;
                    if (pos <= 25) dir = 1;
                    if (frames > 140) { clearInterval(intro); setPosition(wrap.getBoundingClientRect().left + wrap.offsetWidth * 0.5); }
                }, 16);
                obs.disconnect();
            }
        }, { threshold: 0.4 });
        obs.observe(wrap);
    });
});
