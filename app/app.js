/* PRELOADER STRONY */
const preloader = document.querySelector('.preloader');

window.addEventListener('load', () => {
    if (!preloader) return;
    
    setTimeout(() => {
        preloader.classList.add('hidden');
        
        setTimeout(() => preloader.style.display = 'none', 400);
    }, 1000); 
});

// Pokazuje preloader przy płynnym przechodzeniu między podstronami
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link || !preloader) return;

    const href = link.getAttribute('href');

    // Ignoruj brak href, same kotwice i powrót na górę strony (#)
    if (!href || href === '#' || href.startsWith('#')) return;

    // Ignoruj linki otwierane w nowej karcie oraz zewnętrzne
    if (link.target === '_blank') return;
    if (link.hostname !== window.location.hostname) return;

    // Ignoruj linki prowadzące do tej samej podstrony, na której użytkownik już jest
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (href === currentPath) return;

    // Jeśli link przeszedł weryfikację -> uruchamia efekt przejścia
    e.preventDefault();
    preloader.style.display = 'flex';
    preloader.classList.remove('hidden');
    
    // Wydłużony czas przejścia: przetrzymujemy ekran przez 800ms i zmieniamy stronę
    setTimeout(() => window.location.href = href, 800);
});



/* FILTRY OBRAZKÓW */
function zastosuj() {
    const img = document.getElementById('p1');
    if (!img) return;
    
    const blurEl    = document.getElementById('blur');
    const sepiaEl   = document.getElementById('sepia');
    const negatywEl = document.getElementById('negatyw');
    
    const blur    = blurEl ? blurEl.checked    : false;
    const sepia   = sepiaEl ? sepiaEl.checked   : false;
    const negatyw = negatywEl ? negatywEl.checked : false;
    
    let f = '';
    if (blur)    f += 'blur(6px) ';
    if (sepia)   f += 'sepia(100%) ';
    if (negatyw) f += 'invert(100%) ';
    img.style.filter = f.trim();
}

function kolorowy()       { const el = document.getElementById('p2'); if(el) el.style.filter = 'none'; }
function czarnobialy()    { const el = document.getElementById('p2'); if(el) el.style.filter = 'grayscale(100%)'; }

function przezroczystosc(){ 
    const img = document.getElementById('p3'); 
    const input = document.getElementById('przezroczystosc');
    if(!img || !input) return; 
    img.style.filter = 'opacity(' + input.value + '%)'; 
}

function jasnosc()        { 
    const img = document.getElementById('p4'); 
    const input = document.getElementById('jasnosc');
    if(!img || !input) return; 
    img.style.filter = 'brightness(' + input.value + '%)'; 
}

/*  HAMBURGER MENU */
function initHamburger() {
    const toggle = document.getElementById('menu-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
        document.querySelector('.main-nav').classList.toggle('active');
    });
    
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.main-nav').classList.remove('active');
        });
    });
}

/* MOZAIKA */
const mozPhotos = [
    ['./images/baner/baner%20(1).jpg','./images/baner/baner%20(6).jpg','./images/baner/baner%20(11).jpg','./images/baner/baner%20(16).jpg','./images/baner/baner%20(21).jpg','./images/baner/baner%20(26).jpg'],
    ['./images/baner/baner%20(2).jpg','./images/baner/baner%20(7).jpg','./images/baner/baner%20(12).jpg','./images/baner/baner%20(17).jpg','./images/baner/baner%20(22).jpg','./images/baner/baner%20(27).jpg'],
    ['./images/baner/baner%20(3).jpg','./images/baner/baner%20(8).jpg','./images/baner/baner%20(13).jpg','./images/baner/baner%20(18).jpg','./images/baner/baner%20(23).jpg','./images/baner/baner%20(28).jpg'],
    ['./images/baner/baner%20(4).jpg','./images/baner/baner%20(9).jpg','./images/baner/baner%20(14).jpg','./images/baner/baner%20(19).jpg','./images/baner/baner%20(24).jpg'],
    ['./images/baner/baner%20(5).jpg','./images/baner/baner%20(10).jpg','./images/baner/baner%20(15).jpg','./images/baner/baner%20(20).jpg','./images/baner/baner%20(25).jpg'],
];

function initMozaika() {
    const mozWrap = document.getElementById('mozaika') || document.querySelector('.moz-wrap');
    if (!mozWrap) return;

    const lastUsed = [];

    // Tworzenie dynamicznie 5 boksów 
    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('div');
        cell.className = 'moz-cell';
        mozWrap.appendChild(cell);
    }

    const mozCells = mozWrap.querySelectorAll('.moz-cell');

    function rndExcept(exclude, pool) {
        const available = pool.filter(p => !exclude.includes(p));
        return available.length
            ? available[Math.floor(Math.random() * available.length)]
            : pool[Math.floor(Math.random() * pool.length)];
    }

    function initMozCell(cell, i) {
        const pool = mozPhotos[i];
        if (!pool) return;
        const src  = pool[i % pool.length];
        lastUsed[i] = [src];
        const img = document.createElement('img');
        img.className = 'moz-img visible'; // Pierwsze zdjęcie ładuje się jako od razu widoczne
        img.src = src;
        cell.appendChild(img);
    }

    function changeMozCell(idx) {
        const cell    = mozCells[idx];
        if (!cell) return;
        const pool    = mozPhotos[idx];
        const oldImgs = cell.querySelectorAll('.moz-img'); // Łapanie starego zdjęcia
        const newSrc  = rndExcept(lastUsed[idx] || [], pool);
        lastUsed[idx] = [newSrc];
        
        const newImg  = document.createElement('img');
        newImg.className = 'moz-img'; // Nowe startuje ukryte (opacity: 0)
        newImg.src = newSrc;
        cell.appendChild(newImg);
        
        newImg.onload = () => {
            // Zabieranie klasy 'visible' staremu zdjęciu, żeby zaczęło powoli znikać (1.4s w CSS)
            oldImgs.forEach(o => o.classList.remove('visible'));
            
            // Dodawanie klasy 'visible' nowemu zdjęciu, żeby łagodnie się pojawiło
            newImg.classList.add('visible');
            
            // Usuwanie fizycznie starego zdjęcia z kodu strony dopiero, gdy całkiem zgasną
            setTimeout(() => {
                oldImgs.forEach(o => { if(o && o.parentNode) o.remove(); });
            }, 1500);
        };
        
        // Losowanie zmiany dla kolejnej komórki w odstępach od 3.5 do 6.5 sekundy
        setTimeout(() => changeMozCell(idx), 3500 + Math.random() * 3000);
    }

    // Uruchomienie kafelków
    mozCells.forEach((cell, i) => initMozCell(cell, i));
    mozCells.forEach((_, i) => {
        setTimeout(() => changeMozCell(i), 2000 + i * 900 + Math.random() * 1500);
    });
}

/*  CUSTOM SELECT — formularz kontaktowy */
function initCustomSelects() {
    document.querySelectorAll('.custom-select').forEach(function (selectWrap) {
        const trigger      = selectWrap.querySelector('.custom-select-trigger');
        const dropdown     = selectWrap.querySelector('.custom-select-dropdown');
        const options      = selectWrap.querySelectorAll('.custom-select-option');
        const hiddenSelect = selectWrap.querySelector('select');
        
        if (!trigger || !dropdown) return;
        const triggerSpan  = trigger.querySelector('span');

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            document.querySelectorAll('.custom-select.open').forEach(function (el) {
                if (el !== selectWrap) el.classList.remove('open');
            });
            selectWrap.classList.toggle('open');
        });

        options.forEach(function (opt) {
            opt.addEventListener('click', function () {
                const val   = opt.getAttribute('data-value');
                const label = opt.textContent;
                if (triggerSpan) triggerSpan.textContent = label;
                trigger.classList.toggle('has-value', val !== '');
                options.forEach(function (o) { o.classList.remove('selected'); });
                if (val) opt.classList.add('selected');
                if (hiddenSelect) {
                    hiddenSelect.value = val;
                    hiddenSelect.dispatchEvent(new Event('change'));
                }
                selectWrap.classList.remove('open');
            });
        });
    });

    document.addEventListener('click', function () {
        document.querySelectorAll('.custom-select.open').forEach(function (el) {
            el.classList.remove('open');
        });
    });
}

function wyslij(e) {
    e.preventDefault();
    const msg = document.getElementById('successMessage');
    if (msg) {
        msg.style.display = 'block';
        e.target.reset();
        
        document.querySelectorAll('.custom-select').forEach(function (sw) {
            const sp   = sw.querySelector('.custom-select-trigger span');
            const opts = sw.querySelectorAll('.custom-select-option');
            const trig = sw.querySelector('.custom-select-trigger');
            if (sp && opts[0]) sp.textContent = opts[0].textContent;
            if (trig) trig.classList.remove('has-value');
            opts.forEach(function (o) { o.classList.remove('selected'); });
        });
    }
}

/* INIT — uruchamia wszystko po załadowaniu DOM */
document.addEventListener('DOMContentLoaded', function () {
    initHamburger();
    initMozaika();

    initCustomSelects();
    
    const kontaktForm = document.getElementById('contactForm');
    if (kontaktForm) {
        kontaktForm.addEventListener('submit', wyslij);
    }
});


(function () {
    'use strict';

    function initHotspots() {
        const hotspots = document.querySelectorAll('.hotspot');
        const cards    = document.querySelectorAll('.hs-card');

        if (!hotspots.length || !cards.length) return;

        function activate(idx) {
            hotspots.forEach(h => h.classList.toggle('active', +h.dataset.idx === idx));
            cards.forEach(c => c.classList.toggle('active', +c.dataset.idx === idx));
        }

        function deactivateAll() {
            hotspots.forEach(h => h.classList.remove('active'));
            cards.forEach(c => c.classList.remove('active'));
        }

        // Klik na hotspot
        hotspots.forEach(h => {
            h.addEventListener('click', function () {
                const idx = +this.dataset.idx;
                if (this.classList.contains('active')) {
                    deactivateAll();
                } else {
                    activate(idx);
                    if (window.innerWidth < 900) {
                        const panel = document.querySelector('.hs-panel');
                        if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        cards.forEach(c => {
            c.addEventListener('click', function () {
                const idx = +this.dataset.idx;
                if (this.classList.contains('active')) {
                    deactivateAll();
                } else {
                    activate(idx);
                }
            });
        });

        setTimeout(function () { activate(0); }, 800);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHotspots);
    } else {
        initHotspots();
    }

})();