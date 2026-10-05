/* ============================================================
   NERO AGENCY — animations.js
   Tudo o que depende de GSAP + ScrollTrigger + Lenis
   ============================================================
   Índice:
   1. Setup (reduced motion guard, plugin register)
   2. Split text helper
   3. Lenis smooth scroll
   4. Hero mask zoom → fade
   5. Text reveals ([data-split])
   6. Fade-ins ([data-fade])
   7. Service cards stagger
   8. Sticky process cards recede
   9. Portfolio clip-path reveal
  10. CTA ring rotation + Footer curtain
  11. SVG "agency" text positioning
  12. Cursor
  13. Loader + hero entrance
   ============================================================ */

addEventListener('DOMContentLoaded', () => {

    const root = document.documentElement;
    const ld   = document.getElementById('ld');
    const rm   = matchMedia('(prefers-reduced-motion:reduce)').matches;

    /* ── 1. Guard: sem animações se reduced motion ou sem libs ── */
    if (rm || !window.gsap || !window.ScrollTrigger) {
        root.classList.add('rm');
        ld.classList.add('off');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });


    /* ── 2. Split text helper ────────────────────────────────── */
    const split = el => {
        const walk = n => [...n.childNodes].forEach(c => {
            if (c.nodeType === 3) {
                const f = document.createDocumentFragment();
                c.textContent.split(/(\s+)/).forEach(t => {
                    if (!t) return;
                    if (/^\s+$/.test(t)) { f.append(' '); return; }
                    const w = document.createElement('span');
                    w.className = 'w';
                    w.innerHTML = '<span>' + t + '</span>';
                    f.append(w);
                });
                c.replaceWith(f);
            } else if (c.nodeType === 1) walk(c);
        });
        walk(el);
    };


    /* ── 3. Lenis smooth scroll ──────────────────────────────── */
    if (window.Lenis) {
        const lenis = new Lenis({
            duration: 1.1,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(t => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);

        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const h = a.getAttribute('href');
                const t = h.length > 1 && document.querySelector(h);
                if (t || h === '#top') {
                    e.preventDefault();
                    lenis.scrollTo(t || 0);
                }
            });
        });
    }


    /* ── 4. Marquee duplicate ────────────────────────────────── */
    const mt = document.querySelector('.mt');
    mt.innerHTML += mt.innerHTML;


    /* ── 5. Hero mask zoom → fade ────────────────────────────── */
    gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom bottom',
            scrub: .6
        }
    })
        .to('#mt',    { scale: 12, svgOrigin: '500 270', ease: 'power1.in', duration: 1 }, 0)
        .to('.hcopy', { opacity: 0, y: -30, ease: 'none', duration: .2 }, 0)
        .to('.ring',  { opacity: 0, ease: 'none', duration: .3 }, 0)
        .to('.mask',  { opacity: 0, ease: 'none', duration: .35 }, .6)
        .to('.sfade', { opacity: 1, ease: 'none', duration: .25 }, .75);


    /* ── 6. Text reveals ([data-split]) ─────────────────────── */
    document.querySelectorAll('[data-split]').forEach(el => {
        split(el);
        gsap.from(el.querySelectorAll('.w>span'), {
            yPercent: 115,
            duration: 1.1,
            ease: 'power4.out',
            stagger: .045,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
    });


    /* ── 7. Fade-ins ([data-fade]) ───────────────────────────── */
    gsap.utils.toArray('[data-fade]').forEach(el =>
        gsap.from(el, {
            y: 24,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        })
    );


    /* ── 8. Service cards stagger ────────────────────────────── */
    gsap.set('.card', { opacity: 0, y: 50 });
    ScrollTrigger.batch('.card', {
        start: 'top 88%',
        once: true,
        onEnter: b => gsap.to(b, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: .12,
            clearProps: 'transform,opacity'
        })
    });


    /* ── 9. Sticky process cards recede ─────────────────────── */
    const sc = gsap.utils.toArray('.sc');
    sc.forEach((c, i) => {
        if (i < sc.length - 1) {
            gsap.to(c, {
                scale: .94,
                opacity: .55,
                ease: 'none',
                scrollTrigger: {
                    trigger: sc[i + 1],
                    start: 'top 75%',
                    end: 'top 20%',
                    scrub: true
                }
            });
        }
    });


    /* ── 10. Portfolio clip-path reveal ──────────────────────── */
    gsap.utils.toArray('.pj').forEach(p => {
        const st = { trigger: p, start: 'top 82%', once: true };
        gsap.fromTo(
            p.querySelector('.im'),
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: st, clearProps: 'clipPath' }
        );
        gsap.from(p.querySelector('.art'), {
            scale: 1.3,
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: st,
            clearProps: 'transform'
        });
    });


    /* ── 11. CTA ring rotation + Footer curtain ──────────────── */
    gsap.to('.ring2', {
        rotation: 120,
        ease: 'none',
        scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    const ft    = document.getElementById('ft');
    const sp    = document.getElementById('sp');
    const setSp = () => sp.style.height = ft.offsetHeight + 'px';
    setSp();
    addEventListener('resize', () => { setSp(); ScrollTrigger.refresh(); });

    gsap.fromTo('.fi',
        { yPercent: -14, opacity: .15 },
        { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: sp, start: 'top bottom', end: 'bottom bottom', scrub: true } }
    );


    /* ── 12. SVG "agency" text position ─────────────────────── */
    const place = () => {
        try {
            const b = document.getElementById('nm').getExtentOfChar(3);
            document.getElementById('ag').setAttribute('x', b.x + b.width / 2);
        } catch (e) {}
    };
    place();
    document.fonts && document.fonts.ready.then(() => { place(); setSp(); ScrollTrigger.refresh(); });


    /* ── 13. Cursor ──────────────────────────────────────────── */
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
        document.body.classList.add('cc');

        const r = document.querySelector('.cur-ring');
        const d = document.querySelector('.cur-dot');
        let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;

        addEventListener('pointermove', e => {
            x = e.clientX;
            y = e.clientY;
            d.style.transform = `translate3d(${x}px,${y}px,0)`;
        });

        gsap.ticker.add(() => {
            rx += (x - rx) * .18;
            ry += (y - ry) * .18;
            r.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        });

        const on = (s, c) => document.querySelectorAll(s).forEach(el => {
            el.addEventListener('pointerenter', () => {
                r.classList.add(c);
                if (c === 'view') r.firstElementChild.textContent = el.dataset.cursor;
            });
            el.addEventListener('pointerleave', () => r.classList.remove(c));
        });

        on('a,button,.card', 'link');
        on('[data-cursor]', 'view');
    }


    /* ── 14. Loader + hero entrance ──────────────────────────── */
    split(document.querySelector('.hcopy h1'));

    let done = false;
    const go = () => {
        if (done) return;
        done = true;
        gsap.timeline({ onComplete: () => ld.classList.add('off') })
            .to('#ld i',         { scaleX: 1, duration: .6, ease: 'power2.inOut' })
            .to(ld,              { yPercent: -100, duration: .8, ease: 'power4.inOut' })
            .from('#mt',         { opacity: 0, duration: 1.2, ease: 'power2.out' }, '-=.4')
            .from('.hcopy h1 .w>span', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: .05 }, '-=.9')
            .from(['.hr p', '.btns', 'nav', '.ring'], { opacity: 0, y: 16, duration: 1, stagger: .1, ease: 'power3.out' }, '-=.8');
    };

    addEventListener('load', go);
    setTimeout(go, 3000);
    if (document.readyState === 'complete') go();
});
