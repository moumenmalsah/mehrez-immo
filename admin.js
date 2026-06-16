/* ═══════════════════════════════════════════════════════════
   MEHREZ-IMMO — ADMIN JS
   Stockage : localStorage
   Clés : mi_categories, mi_biens, mi_offre
═══════════════════════════════════════════════════════════ */

/* ── Credentials (modifiable ici) ── */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'mehrez2025';

/* ── Default data ── */
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', icon: '🏢', name: 'Appartement à vendre',    desc: 'Investissez dans votre futur',          filter: 'appt-vente'    },
  { id: 'cat-2', icon: '🔑', name: 'Appartement de location', desc: 'Location courte & longue durée',        filter: 'appt-location' },
  { id: 'cat-3', icon: '🏡', name: 'Villa / Maison à vendre', desc: 'Propriétés de prestige',                filter: 'villa-vente'   },
  { id: 'cat-4', icon: '🌴', name: 'Villa / Maison de location', desc: 'Séjours et vacances de luxe',        filter: 'villa-location'},
  { id: 'cat-5', icon: '🌿', name: 'Terrain à vendre',        desc: 'Construisez votre projet sur mesure à Saïdia', filter: 'terrain-vente' },
];

const DEFAULT_BIENS = [
  { id: 'b-1', titre: 'Appartement Vue Mer S+2',  categorie: 'appt-vente',    loc: 'Résidence Marina, Saïdia',     prix: '1 850 000', prixUnit: 'MAD',      chambres: 3, sdb: 2, surface: 110, img: 'assets/prop1.jpg', badge2: '🌊 Vue Mer' },
  { id: 'b-2', titre: 'Appartement Moderne S+1',  categorie: 'appt-location', loc: 'Centre-ville, Saïdia',         prix: '3 500',     prixUnit: 'MAD/mois', chambres: 2, sdb: 1, surface: 75,  img: 'assets/prop2.jpg', badge2: '' },
  { id: 'b-3', titre: 'Villa de Prestige',         categorie: 'villa-vente',   loc: 'Résidence Al Nour, Saïdia',   prix: '3 200 000', prixUnit: 'MAD',      chambres: 4, sdb: 3, surface: 180, img: 'assets/prop3.jpg', badge2: 'Nouveau' },
  { id: 'b-4', titre: 'Studio Bord de Mer',        categorie: 'appt-location', loc: 'Corniche, Saïdia',             prix: '4 500',     prixUnit: 'MAD/mois', chambres: 1, sdb: 1, surface: 45,  img: 'assets/prop4.jpg', badge2: '🌊 Vue Mer' },
  { id: 'b-5', titre: 'Villa Panoramique',          categorie: 'villa-location',loc: 'Tour Méditerranée, Saïdia',   prix: '12 000',    prixUnit: 'MAD/mois', chambres: 5, sdb: 4, surface: 280, img: 'assets/prop5.jpg', badge2: '⭐ Premium' },
  { id: 'b-6', titre: 'Terrain Résidentiel',        categorie: 'terrain-vente', loc: 'Résidence Soleil, Saïdia',    prix: '480 000',   prixUnit: 'MAD',      chambres: 0, sdb: 0, surface: 350, img: 'assets/prop6.jpg', badge2: '' },
];

const DEFAULT_OFFRE = {
  tag:    '⭐ Offre Exclusive',
  titre:  'Saison Estivale 2025',
  desc:   'Réservez votre appartement en bord de mer dès maintenant et bénéficiez d\'une remise exceptionnelle',
  badge:  'Jusqu\'à 20% de remise sur la location saisonnière',
  remise: '20%',
  date:   '2025-07-31',
};

/* ── Storage helpers ── */
const store = {
  get: (key, def) => { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } },
  set: (key, val)  => localStorage.setItem(key, JSON.stringify(val)),
};

function getCategories() { return store.get('mi_categories', DEFAULT_CATEGORIES); }
function getBiens()      { return store.get('mi_biens',      DEFAULT_BIENS);      }
function getOffre()      { return store.get('mi_offre',      DEFAULT_OFFRE);      }
function saveCategories(d) { store.set('mi_categories', d); }
function saveBiens(d)      { store.set('mi_biens',      d); }
function saveOffre(d)      { store.set('mi_offre',      d); }

/* ── ID generator ── */
const uid = () => 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);

/* ══════════════════════════════════════════
   LOGIN
══════════════════════════════════════════ */
const loginScreen = document.getElementById('loginScreen');
const adminShell  = document.getElementById('adminShell');

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    loginScreen.style.display = 'none';
    adminShell.style.display  = 'flex';
    initAdmin();
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
});

document.getElementById('pwToggle').addEventListener('click', () => {
  const inp = document.getElementById('loginPass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  adminShell.style.display  = 'none';
  loginScreen.style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
});

/* ══════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════ */
const sectionTitles = {
  dashboard:  'Tableau de bord',
  categories: 'Catégories',
  biens:      'Nos biens',
  offre:      'Offre exclusive',
  tiktok:     'Vidéos TikTok',
};

function showSection(name) {
  document.querySelectorAll('.section-panel').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  document.querySelector(`[data-section="${name}"]`).classList.add('active');
  document.getElementById('topbarTitle').textContent = sectionTitles[name];
  closeSidebar();
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => { e.preventDefault(); showSection(item.dataset.section); });
});

/* Mobile sidebar */
const sidebar = document.getElementById('sidebar');
document.getElementById('burgerAdmin').addEventListener('click',  () => sidebar.classList.add('open'));
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
function closeSidebar() { sidebar.classList.remove('open'); }

/* ══════════════════════════════════════════
   MODALS
══════════════════════════════════════════ */
function openModal(id)  { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});
document.querySelectorAll('.modal-overlay').forEach(ov => {
  ov.addEventListener('click', e => { if (e.target === ov) closeModal(ov.id); });
});

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function renderDashboard() {
  const cats  = getCategories();
  const biens = getBiens();
  document.getElementById('dashCatCount').textContent   = cats.length;
  document.getElementById('dashBienCount').textContent  = biens.length;
  document.getElementById('dashVenteCount').textContent = biens.filter(b => b.prixUnit === 'MAD').length;
  document.getElementById('dashLocCount').textContent   = biens.filter(b => b.prixUnit === 'MAD/mois').length;

  const list = document.getElementById('dashRecentList');
  list.innerHTML = biens.slice(0, 5).map(b => `
    <div class="recent-item">
      <img class="recent-img" src="${b.img || ''}" alt="${b.titre}" onerror="this.style.display='none'" />
      <div class="recent-info">
        <div class="recent-title">${b.titre}</div>
        <div class="recent-meta">${catLabel(b.categorie)} · ${b.loc}</div>
      </div>
      <span class="recent-price">${b.prix} <small>${b.prixUnit}</small></span>
    </div>`).join('');
}

function catLabel(filterId) {
  const cats = getCategories();
  return cats.find(c => c.filter === filterId)?.name || filterId;
}

/* ══════════════════════════════════════════
   CATEGORIES
══════════════════════════════════════════ */
function renderCategories() {
  const cats = getCategories();
  const tbody = document.getElementById('catTableBody');
  if (!cats.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Aucune catégorie. Cliquez sur "+ Ajouter" pour commencer.</td></tr>';
    return;
  }
  tbody.innerHTML = cats.map(c => `
    <tr>
      <td data-label="Icône" class="td-icon">${c.icon}</td>
      <td data-label="Nom"><strong>${c.name}</strong></td>
      <td data-label="Description">${c.desc}</td>
      <td data-label="Filtre ID"><code style="background:var(--black-4);padding:2px 8px;border-radius:4px;font-size:.75rem;">${c.filter}</code></td>
      <td data-label="Actions">
        <div class="action-btns">
          <button class="btn-edit" onclick="editCat('${c.id}')">✏️ Modifier</button>
          <button class="btn-del"  onclick="deleteCat('${c.id}')">🗑 Supprimer</button>
        </div>
      </td>
    </tr>`).join('');
}

document.getElementById('btnAddCat').addEventListener('click', () => {
  document.getElementById('modalCatTitle').textContent = 'Ajouter une catégorie';
  document.getElementById('catForm').reset();
  document.getElementById('catId').value = '';
  openModal('modalCat');
});

document.getElementById('catForm').addEventListener('submit', e => {
  e.preventDefault();
  const cats  = getCategories();
  const id    = document.getElementById('catId').value;
  const entry = {
    id:     id || uid(),
    icon:   document.getElementById('catIcon').value.trim()   || '🏠',
    name:   document.getElementById('catName').value.trim(),
    desc:   document.getElementById('catDesc').value.trim(),
    filter: document.getElementById('catFilter').value.trim().replace(/\s+/g, '-').toLowerCase(),
  };
  if (id) {
    const idx = cats.findIndex(c => c.id === id);
    if (idx > -1) cats[idx] = entry;
  } else {
    cats.push(entry);
  }
  saveCategories(cats);
  closeModal('modalCat');
  renderCategories();
  renderDashboard();
  refreshBienCatSelect();
});

window.editCat = (id) => {
  const cat = getCategories().find(c => c.id === id);
  if (!cat) return;
  document.getElementById('modalCatTitle').textContent = 'Modifier la catégorie';
  document.getElementById('catId').value     = cat.id;
  document.getElementById('catIcon').value   = cat.icon;
  document.getElementById('catName').value   = cat.name;
  document.getElementById('catDesc').value   = cat.desc;
  document.getElementById('catFilter').value = cat.filter;
  openModal('modalCat');
};

window.deleteCat = (id) => {
  const cat = getCategories().find(c => c.id === id);
  document.getElementById('deleteMsg').textContent = `Voulez-vous vraiment supprimer la catégorie "${cat?.name}" ?`;
  document.getElementById('confirmDeleteBtn').onclick = () => {
    saveCategories(getCategories().filter(c => c.id !== id));
    closeModal('modalDelete');
    renderCategories();
    renderDashboard();
  };
  openModal('modalDelete');
};

/* ══════════════════════════════════════════
   BIENS
══════════════════════════════════════════ */
function renderBiens() {
  const biens = getBiens();
  const tbody = document.getElementById('bienTableBody');
  if (!biens.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Aucun bien. Cliquez sur "+ Ajouter" pour commencer.</td></tr>';
    return;
  }
  tbody.innerHTML = biens.map(b => `
    <tr>
      <td data-label="Photo">
        <img class="td-img" src="${b.img || ''}" alt="${b.titre}" onerror="this.src=''" />
      </td>
      <td data-label="Titre"><strong>${b.titre}</strong></td>
      <td data-label="Catégorie"><span class="badge-cat">${catLabel(b.categorie)}</span></td>
      <td data-label="Localisation">${b.loc}</td>
      <td data-label="Prix"><span style="color:var(--gold);font-weight:600">${b.prix} ${b.prixUnit}</span></td>
      <td data-label="Actions">
        <div class="action-btns">
          <button class="btn-edit" onclick="editBien('${b.id}')">✏️ Modifier</button>
          <button class="btn-del"  onclick="deleteBien('${b.id}')">🗑 Supprimer</button>
        </div>
      </td>
    </tr>`).join('');
}

function refreshBienCatSelect() {
  const sel  = document.getElementById('bienCategorie');
  const cats = getCategories();
  const cur  = sel.value;
  sel.innerHTML = '<option value="" disabled>Choisir une catégorie</option>' +
    cats.map(c => `<option value="${c.filter}" ${c.filter === cur ? 'selected' : ''}>${c.name}</option>`).join('');
}

document.getElementById('btnAddBien').addEventListener('click', () => {
  document.getElementById('modalBienTitle').textContent = 'Ajouter un bien';
  document.getElementById('bienForm').reset();
  document.getElementById('bienId').value = '';
  document.getElementById('bienImgPreview').style.display = 'none';
  document.getElementById('bienImgPreview').src = '';
  refreshBienCatSelect();
  openModal('modalBien');
});

/* Image preview */
document.getElementById('bienImgUrl').addEventListener('input', e => {
  const url = e.target.value.trim();
  const img = document.getElementById('bienImgPreview');
  if (url) { img.src = url; img.style.display = 'block'; }
  else { img.style.display = 'none'; }
});

document.getElementById('bienImgFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = document.getElementById('bienImgPreview');
    img.src = ev.target.result;
    img.style.display = 'block';
    document.getElementById('bienImgUrl').value = ev.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('bienForm').addEventListener('submit', e => {
  e.preventDefault();
  const biens = getBiens();
  const id    = document.getElementById('bienId').value;
  const entry = {
    id:        id || uid(),
    titre:     document.getElementById('bienTitre').value.trim(),
    categorie: document.getElementById('bienCategorie').value,
    loc:       document.getElementById('bienLoc').value.trim(),
    img:       document.getElementById('bienImgUrl').value.trim(),
    chambres:  parseInt(document.getElementById('bienChambres').value) || 0,
    sdb:       parseInt(document.getElementById('bienSDB').value)      || 0,
    surface:   parseInt(document.getElementById('bienSurface').value)  || 0,
    prix:      document.getElementById('bienPrix').value.trim(),
    prixUnit:  document.getElementById('bienPrixUnit').value,
    badge2:    document.getElementById('bienBadge2').value.trim(),
  };
  if (id) {
    const idx = biens.findIndex(b => b.id === id);
    if (idx > -1) biens[idx] = entry;
  } else {
    biens.push(entry);
  }
  saveBiens(biens);
  closeModal('modalBien');
  renderBiens();
  renderDashboard();
});

window.editBien = (id) => {
  const b = getBiens().find(b => b.id === id);
  if (!b) return;
  document.getElementById('modalBienTitle').textContent = 'Modifier le bien';
  document.getElementById('bienId').value        = b.id;
  document.getElementById('bienTitre').value     = b.titre;
  document.getElementById('bienLoc').value       = b.loc;
  document.getElementById('bienImgUrl').value    = b.img;
  document.getElementById('bienChambres').value  = b.chambres;
  document.getElementById('bienSDB').value       = b.sdb;
  document.getElementById('bienSurface').value   = b.surface;
  document.getElementById('bienPrix').value      = b.prix;
  document.getElementById('bienBadge2').value    = b.badge2;
  refreshBienCatSelect();
  document.getElementById('bienCategorie').value = b.categorie;
  document.getElementById('bienPrixUnit').value  = b.prixUnit;
  const img = document.getElementById('bienImgPreview');
  if (b.img) { img.src = b.img; img.style.display = 'block'; }
  else { img.style.display = 'none'; }
  openModal('modalBien');
};

window.deleteBien = (id) => {
  const b = getBiens().find(b => b.id === id);
  document.getElementById('deleteMsg').textContent = `Voulez-vous vraiment supprimer le bien "${b?.titre}" ?`;
  document.getElementById('confirmDeleteBtn').onclick = () => {
    saveBiens(getBiens().filter(b => b.id !== id));
    closeModal('modalDelete');
    renderBiens();
    renderDashboard();
  };
  openModal('modalDelete');
};

/* ══════════════════════════════════════════
   OFFRE EXCLUSIVE
══════════════════════════════════════════ */
function loadOffreForm() {
  const o = getOffre();
  document.getElementById('offreTitre').value  = o.titre  || '';
  document.getElementById('offreTag').value    = o.tag    || '';
  document.getElementById('offreDesc').value   = o.desc   || '';
  document.getElementById('offreRemise').value = o.remise || '';
  document.getElementById('offreBadge').value  = o.badge  || '';
  document.getElementById('offreDate').value   = o.date   || '';
}

document.getElementById('offreForm').addEventListener('submit', e => {
  e.preventDefault();
  saveOffre({
    titre:  document.getElementById('offreTitre').value.trim(),
    tag:    document.getElementById('offreTag').value.trim(),
    desc:   document.getElementById('offreDesc').value.trim(),
    remise: document.getElementById('offreRemise').value.trim(),
    badge:  document.getElementById('offreBadge').value.trim(),
    date:   document.getElementById('offreDate').value,
  });
  const saved = document.getElementById('offreSaved');
  saved.style.display = 'block';
  setTimeout(() => { saved.style.display = 'none'; }, 3000);
});

/* ══════════════════════════════════════════
   TIKTOK VIDEOS
══════════════════════════════════════════ */
const TT_KEY = 'mi_tiktok_videos';

function getTTVideos() { return store.get(TT_KEY, []); }
function saveTTVideos(d) { store.set(TT_KEY, d); }

function renderTTVideos() {
  const videos = getTTVideos();
  const list   = document.getElementById('ttVideoList');
  if (!videos.length) {
    list.innerHTML = '<p class="empty-tt">Aucune vidéo ajoutée. Collez une URL TikTok ci-dessus pour commencer.</p>';
    return;
  }
  list.innerHTML = videos.map((v, i) => {
    const videoId = (v.url.match(/\/video\/(\d+)/) || [])[1] || '—';
    const thumbUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(v.url)}`;
    return `
      <div class="tt-video-item" data-id="${v.id}">
        <div class="tt-order-btns">
          ${i > 0               ? `<button class="tt-order-btn" onclick="moveTTVideo('${v.id}', -1)">▲</button>` : '<span class="tt-order-btn tt-order-disabled">▲</span>'}
          ${i < videos.length-1 ? `<button class="tt-order-btn" onclick="moveTTVideo('${v.id}',  1)">▼</button>` : '<span class="tt-order-btn tt-order-disabled">▼</span>'}
        </div>
        <div class="tt-video-thumb">
          <div class="tt-thumb-placeholder">🎵</div>
        </div>
        <div class="tt-video-meta">
          <div class="tt-video-num">#${i + 1}</div>
          <div class="tt-video-url" title="${v.url}">${v.url.length > 60 ? v.url.slice(0, 57) + '…' : v.url}</div>
          ${v.desc ? `<div class="tt-video-desc">${v.desc}</div>` : ''}
          <div class="tt-video-id">ID : <code>${videoId}</code></div>
        </div>
        <div class="tt-video-actions">
          <a href="${v.url}" target="_blank" class="btn-edit">↗ Voir</a>
          <button class="btn-del" onclick="deleteTTVideo('${v.id}')">🗑</button>
        </div>
      </div>`;
  }).join('');
}

document.getElementById('ttAddForm').addEventListener('submit', e => {
  e.preventDefault();
  const url      = document.getElementById('ttUrl').value.trim();
  const username = document.getElementById('ttUsername').value.trim() || 'hassane.immo';
  const desc     = document.getElementById('ttDesc').value.trim();

  if (!url) return;

  const videos = getTTVideos();
  videos.push({ id: uid(), url, username, desc });
  saveTTVideos(videos);
  document.getElementById('ttAddForm').reset();
  document.getElementById('ttUsername').value = 'hassane.immo';
  renderTTVideos();
});

window.deleteTTVideo = (id) => {
  document.getElementById('deleteMsg').textContent = 'Voulez-vous vraiment supprimer cette vidéo TikTok ?';
  document.getElementById('confirmDeleteBtn').onclick = () => {
    saveTTVideos(getTTVideos().filter(v => v.id !== id));
    closeModal('modalDelete');
    renderTTVideos();
  };
  openModal('modalDelete');
};

window.moveTTVideo = (id, dir) => {
  const videos = getTTVideos();
  const idx    = videos.findIndex(v => v.id === id);
  if (idx < 0) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= videos.length) return;
  [videos[idx], videos[newIdx]] = [videos[newIdx], videos[idx]];
  saveTTVideos(videos);
  renderTTVideos();
};

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
function initAdmin() {
  renderDashboard();
  renderCategories();
  renderBiens();
  loadOffreForm();
  refreshBienCatSelect();
  renderTTVideos();
}
