/* ============================================================
   NERO AGENCY — script.js
   Interações de UI: formulário de contacto + scroll nav
   ============================================================
   Índice:
   1. Scroll Nav (bolinhas)
   2. Formulário de Contacto (CTA)
   ============================================================ */


/* ── 1. Scroll Nav (bolinhas) ────────────────────────────── */
const sections  = document.querySelectorAll('section, header');
const scrollNav = document.getElementById('scrollNav');
const heroHeight = sections[0]?.offsetHeight || window.innerHeight;

// Cria botões para cada secção (salta o hero)
sections.forEach((sec, i) => {
    if (i === 0) return;
    const btn = document.createElement('button');
    btn.dataset.index = i;
    btn.title = sec.id || 'Secção ' + i;
    btn.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth' }));
    scrollNav.append(btn);
});

const updateScroll = () => {
    const scrollPos = window.scrollY;
    scrollNav.classList.toggle('show', scrollPos > heroHeight * 0.5);

    let current = 0;
    sections.forEach((sec, i) => {
        if (i === 0) return;
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) current = i - 1;
    });

    document.querySelectorAll('.scroll-nav button').forEach((btn, i) => {
        btn.classList.toggle('active', i === current);
    });
};

addEventListener('scroll', updateScroll);
updateScroll();


/* ── 2. Formulário de Contacto (CTA) ────────────────────── */
const ctaBtn   = document.getElementById('ctaBtn');
const ctaForm  = document.getElementById('ctaForm');
const ctaInner = document.querySelector('.cta-inner');

ctaBtn.addEventListener('click', () => {
    ctaInner.classList.toggle('open');

    if (ctaInner.classList.contains('open')) {
        ctaForm.querySelector('input').focus();
        ctaBtn.textContent = 'Fechar';
    } else {
        ctaBtn.textContent = 'Marcar discovery call';
    }
});

document.getElementById('discoveryForm').addEventListener('submit', async e => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    formData.append("access_key", "cbd19f38-9278-4482-bc4e-e585ff5ef948");

    const btnOriginal = ctaBtn.textContent;
    ctaBtn.textContent = 'Enviando...';
    ctaBtn.disabled = true;

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            ctaBtn.textContent = 'Marcar discovery call';
            ctaInner.classList.remove('open');
            form.reset();
            alert('Pedido enviado! Respondemos em menos de 24 horas.');
        } else {
            alert('Erro ao enviar. Tenta novamente.');
        }
    } catch (error) {
        alert('Algo correu mal. Tenta novamente.');
    } finally {
        ctaBtn.textContent = btnOriginal;
        ctaBtn.disabled = false;
    }
});
