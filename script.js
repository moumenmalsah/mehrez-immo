const CAT_BADGE_MAP = {
  'appt-vente':    { cls: 'badge-vente',    label: 'Appt. à vendre'      },
  'appt-location': { cls: 'badge-location', label: 'Appt. de location'   },
  'villa-vente':   { cls: 'badge-vente',    label: 'Villa à vendre'       },
  'villa-location':{ cls: 'badge-location', label: 'Villa de location'    },
  'terrain-vente': { cls: 'badge-vente',    label: 'Terrain à vendre'     },
};

function badge2Class(text) {
  if (!text) return '';
  if (text.includes('Mer'))     return 'badge-mer';
  if (text.includes('Premium')) return 'badge-premium';
  if (text === 'Nouveau')       return 'badge-new';
  return 'badge-mer';
}

function catLabel(filterId, cats) {
  return cats?.find(c => c.filter === filterId)?.name || filterId;
}

/* ── Catégories ── */
function buildCategories(cats) {
  const grid = document.querySelector('.categories-grid');
  if (!grid || !cats?.length) return;

  grid.innerHTML = cats.map((c, i) => {
    const isLast  = i === cats.length - 1;
    const isOdd   = cats.length % 2 !== 0;
    const wideClass = (isLast && isOdd) ? 'cat-card--wide' : '';
    return `
      <div class="cat-card ${wideClass}" data-filter-target="${c.filter}">
        <div class="cat-overlay"></div>
        <div class="cat-content">
          <div class="cat-icon">${c.icon}</div>
          <h3>${c.name}</h3>
          <p>${c.desc}</p>
          <a href="#listings" class="cat-link">Voir les biens →</a>
        </div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.cat-card').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  rebuildFilterTabs(cats);
}

function rebuildFilterTabs(cats) {
  const tabsWrap = document.querySelector('.filter-tabs');
  if (!tabsWrap || !cats?.length) return;
  tabsWrap.innerHTML = `<button class="filter-btn active" data-filter="all">Tous</button>` +
    cats.map(c => `<button class="filter-btn" data-filter="${c.filter}">${c.name}</button>`).join('');
  initFilters();
}

/* ── Biens ── */
function buildBiens(biens, cats) {
  const grid = document.getElementById('listingsGrid');
  if (!grid || !biens?.length) return;

  grid.innerHTML = biens.map(b => {
    const cat    = CAT_BADGE_MAP[b.categorie] || { cls: 'badge-vente', label: catLabel(b.categorie, cats) };
    const specs  = [
      b.chambres > 0 ? `<span>🛏 ${b.chambres} chambre${b.chambres > 1 ? 's' : ''}</span>` : '',
      b.sdb      > 0 ? `<span>🚿 ${b.sdb} SDB</span>`       : '',
      b.surface  > 0 ? `<span>📐 ${b.surface} m²</span>`    : '',
    ].filter(Boolean).join('');

    const badge2 = b.badge2
      ? `<span class="prop-badge ${badge2Class(b.badge2)}">${b.badge2}</span>`
      : '';

    return `
      <div class="prop-card" data-type="${b.categorie}">
        <div class="prop-img-wrap">
          <img src="${b.img || ''}" alt="${b.titre}" loading="lazy" onerror="this.style.opacity='.3'" />
          <span class="prop-badge ${cat.cls}">${cat.label}</span>
          ${badge2}
        </div>
        <div class="prop-info">
          <h3 class="prop-title">${b.titre}</h3>
          <p class="prop-location">📍 ${b.loc}</p>
          <div class="prop-specs">${specs}</div>
          <div class="prop-footer">
            <span class="prop-price">${b.prix} <small>${b.prixUnit}</small></span>
            <a href="#contact" class="btn btn-gold btn-sm">Contacter</a>
          </div>
        </div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.prop-card').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  initFilters();
}

/* ── Offre exclusive ── */
function buildOffre(o) {
  if (!o) return;
  const tagEl   = document.querySelector('.offer-tag');
  const titreEl = document.querySelector('.offer-title');
  const subEl   = document.querySelector('.offer-sub');
  const badgeEl = document.querySelector('.offer-badge');
  if (tagEl)   tagEl.textContent   = o.tag;
  if (titreEl) titreEl.textContent = o.titre;
  if (subEl)   subEl.textContent   = o.desc;
  if (badgeEl) badgeEl.innerHTML   = `Jusqu'à <strong>${o.remise} de remise</strong> — ${o.badge}`;
  if (o.date)  window._offreDate = o.date + 'T23:59:59';
}

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.prop-card, .cat-card, .review-card, .tiktok-card, .about-grid, .contact-grid, .section-header'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ══════════════════════════════════════════
   FILTER TABS
══════════════════════════════════════════ */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const propCards  = document.querySelectorAll('.prop-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      propCards.forEach(card => {
        const type = card.dataset.type || '';
        card.classList.toggle('hidden', filter !== 'all' && type !== filter);
      });
    });
  });
}

initFilters();

/* ══════════════════════════════════════════
   COUNTDOWN TIMER
══════════════════════════════════════════ */
window._offreDate = '2025-07-31T23:59:59';

function updateCountdown() {
  const target = new Date(window._offreDate).getTime();
  const diff   = target - Date.now();

  if (diff <= 0) {
    const cd = document.getElementById('countdown');
    if (cd) cd.innerHTML = '<p style="color:var(--gold);font-size:1.1rem">Offre expirée</p>';
    return;
  }

  const pad = n => String(Math.floor(n)).padStart(2, '0');
  const el  = id => document.getElementById(id);
  if (el('cd-days'))  el('cd-days').textContent  = pad(diff / 86400000);
  if (el('cd-hours')) el('cd-hours').textContent = pad((diff % 86400000) / 3600000);
  if (el('cd-mins'))  el('cd-mins').textContent  = pad((diff % 3600000)  / 60000);
  if (el('cd-secs'))  el('cd-secs').textContent  = pad((diff % 60000)    / 1000);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btnText   = form.querySelector('.btn-text');
  const btnLoader = form.querySelector('.btn-loader');
  const success   = document.getElementById('formSuccess');
  btnText.style.display   = 'none';
  btnLoader.style.display = 'inline';
  setTimeout(() => {
    btnText.style.display   = 'inline';
    btnLoader.style.display = 'none';
    success.style.display   = 'block';
    form.reset();
    setTimeout(() => { success.style.display = 'none'; }, 6000);
  }, 1800);
});

/* ══════════════════════════════════════════
   ACTIVE NAV ON SCROLL
══════════════════════════════════════════ */
const navLinks   = document.querySelectorAll('.nav-links a');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link =>
        link.classList.toggle('active-link', link.getAttribute('href') === `#${entry.target.id}`)
      );
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

/* ══════════════════════════════════════════
   LOAD DATA FROM FIRESTORE
══════════════════════════════════════════ */
async function loadFirestoreData() {
  try {
    const [catSnap, bienSnap, offreDoc] = await Promise.all([
      db.collection('categories').orderBy('createdAt').get(),
      db.collection('biens').orderBy('createdAt').get(),
      db.doc('config/offre').get(),
    ]);

    const cats  = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const biens = bienSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const offre = offreDoc.exists ? offreDoc.data() : null;

    window._galBiens = biens;
    window._galCats  = cats;

    if (cats.length)  buildCategories(cats);
    if (biens.length) buildBiens(biens, cats);
    if (offre)        buildOffre(offre);
  } catch {
  }
}

loadFirestoreData();

/* ══════════════════════════════════════════
   GALERIE MODAL
══════════════════════════════════════════ */
let galIndex = 0;
let galImages = [];

document.getElementById('listingsGrid')?.addEventListener('click', e => {
  const card = e.target.closest('.prop-card');
  if (!card || e.target.closest('a, .btn')) return;
  const biens = window._galBiens;
  if (!biens) return;
  const type  = card.dataset.type;
  const title = card.querySelector('.prop-title')?.textContent || '';
  const b     = biens.find(bi => bi.titre === title && bi.categorie === type);
  if (!b) return;
  const allImgs = [b.img, ...(b.images || [])].filter(Boolean);
  if (!allImgs.length) return;
  galImages = allImgs;
  galIndex  = 0;
  openGallery(b.titre);
});

function openGallery(title) {
  const modal = document.getElementById('galModal');
  const img   = document.getElementById('galImg');
  const ctr   = document.getElementById('galCounter');
  const ttl   = document.getElementById('galTitle');
  if (!modal) return;
  modal.style.display = 'flex';
  showGalImage();
  if (ttl) ttl.textContent = title;
  document.body.style.overflow = 'hidden';
}

function showGalImage() {
  const img = document.getElementById('galImg');
  const ctr = document.getElementById('galCounter');
  if (img) img.src = galImages[galIndex] || '';
  if (ctr) ctr.textContent = `${galIndex + 1} / ${galImages.length}`;
}

document.getElementById('galClose')?.addEventListener('click', closeGallery);
document.getElementById('galBackdrop')?.addEventListener('click', closeGallery);
document.getElementById('galPrev')?.addEventListener('click', () => { galIndex = (galIndex - 1 + galImages.length) % galImages.length; showGalImage(); });
document.getElementById('galNext')?.addEventListener('click', () => { galIndex = (galIndex + 1) % galImages.length; showGalImage(); });

document.addEventListener('keydown', e => {
  if (document.getElementById('galModal')?.style.display !== 'flex') return;
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowLeft') { galIndex = (galIndex - 1 + galImages.length) % galImages.length; showGalImage(); }
  if (e.key === 'ArrowRight') { galIndex = (galIndex + 1) % galImages.length; showGalImage(); }
});

function closeGallery() {
  document.getElementById('galModal').style.display = 'none';
  document.body.style.overflow = '';
}
