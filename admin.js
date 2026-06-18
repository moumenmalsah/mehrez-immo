/* ── Default data (used as fallback) ── */
const DEFAULT_CATEGORIES = [
  { icon: '🏢', name: 'Appartement à vendre',    desc: 'Investissez dans votre futur',          filter: 'appt-vente'    },
  { icon: '🔑', name: 'Appartement de location', desc: 'Location courte & longue durée',        filter: 'appt-location' },
  { icon: '🏡', name: 'Villa / Maison à vendre', desc: 'Propriétés de prestige',                filter: 'villa-vente'   },
  { icon: '🌴', name: 'Villa / Maison de location', desc: 'Séjours et vacances de luxe',        filter: 'villa-location'},
  { icon: '🌿', name: 'Terrain à vendre',        desc: 'Construisez votre projet sur mesure à Saïdia', filter: 'terrain-vente' },
];

const DEFAULT_BIENS = [
  { titre: 'Appartement Vue Mer S+2',  categorie: 'appt-vente',    loc: 'Résidence Marina, Saïdia',     prix: '1 850 000', prixUnit: 'MAD',      chambres: 3, sdb: 2, surface: 110, img: 'assets/prop1.jpg', badge2: '🌊 Vue Mer' },
  { titre: 'Appartement Moderne S+1',  categorie: 'appt-location', loc: 'Centre-ville, Saïdia',         prix: '3 500',     prixUnit: 'MAD/mois', chambres: 2, sdb: 1, surface: 75,  img: 'assets/prop2.jpg', badge2: '' },
  { titre: 'Villa de Prestige',         categorie: 'villa-vente',   loc: 'Résidence Al Nour, Saïdia',   prix: '3 200 000', prixUnit: 'MAD',      chambres: 4, sdb: 3, surface: 180, img: 'assets/prop3.jpg', badge2: 'Nouveau' },
  { titre: 'Studio Bord de Mer',        categorie: 'appt-location', loc: 'Corniche, Saïdia',             prix: '4 500',     prixUnit: 'MAD/mois', chambres: 1, sdb: 1, surface: 45,  img: 'assets/prop4.jpg', badge2: '🌊 Vue Mer' },
  { titre: 'Villa Panoramique',          categorie: 'villa-location',loc: 'Tour Méditerranée, Saïdia',   prix: '12 000',    prixUnit: 'MAD/mois', chambres: 5, sdb: 4, surface: 280, img: 'assets/prop5.jpg', badge2: '⭐ Premium' },
  { titre: 'Terrain Résidentiel',        categorie: 'terrain-vente', loc: 'Résidence Soleil, Saïdia',    prix: '480 000',   prixUnit: 'MAD',      chambres: 0, sdb: 0, surface: 350, img: 'assets/prop6.jpg', badge2: '' },
];

const DEFAULT_OFFRE = {
  tag:    '⭐ Offre Exclusive',
  titre:  'Saison Estivale 2025',
  desc:   'Réservez votre appartement en bord de mer dès maintenant et bénéficiez d\'une remise exceptionnelle',
  badge:  'Jusqu\'à 20% de remise sur la location saisonnière',
  remise: '20%',
  date:   '2025-07-31',
};

/* ── Firestore helpers ── */
async function getCategories() {
  const snap = await db.collection('categories').orderBy('createdAt').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getBiens() {
  const snap = await db.collection('biens').orderBy('createdAt').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getOffre() {
  const doc = await db.doc('config/offre').get();
  return doc.exists ? doc.data() : null;
}

async function getTTVideos() {
  const snap = await db.collection('tiktok_videos').orderBy('order').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ── ID generator ── */
const uid = () => 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);

/* ══════════════════════════════════════════
   LOGIN / AUTH
══════════════════════════════════════════ */
const loginScreen = document.getElementById('loginScreen');
const adminShell  = document.getElementById('adminShell');

auth.onAuthStateChanged(user => {
  if (user) {
    loginScreen.style.display = 'none';
    adminShell.style.display  = 'flex';
    initAdmin();
  } else {
    loginScreen.style.display = 'flex';
    adminShell.style.display  = 'none';
    document.getElementById('loginError').style.display = 'none';
  }
});

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('loginUser').value.trim();
  const pass  = document.getElementById('loginPass').value;
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch {
    document.getElementById('loginError').style.display = 'block';
  }
});

document.getElementById('pwToggle').addEventListener('click', () => {
  const inp = document.getElementById('loginPass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  auth.signOut();
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
async function renderDashboard() {
  const cats  = await getCategories();
  const biens = await getBiens();
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
        <div class="recent-meta">${catLabel(b.categorie, cats)} · ${b.loc}</div>
      </div>
      <span class="recent-price">${b.prix} <small>${b.prixUnit}</small></span>
    </div>`).join('');
}

function catLabel(filterId, cats) {
  return cats?.find(c => c.filter === filterId)?.name || filterId;
}

/* ══════════════════════════════════════════
   CATEGORIES
══════════════════════════════════════════ */
async function renderCategories() {
  const cats = await getCategories();
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
          <button class="btn-edit" data-action="edit-cat" data-id="${c.id}">✏️ Modifier</button>
          <button class="btn-del"  data-action="delete-cat" data-id="${c.id}">🗑 Supprimer</button>
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

document.getElementById('catForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id    = document.getElementById('catId').value;
  const data  = {
    icon:   document.getElementById('catIcon').value.trim()   || '🏠',
    name:   document.getElementById('catName').value.trim(),
    desc:   document.getElementById('catDesc').value.trim(),
    filter: document.getElementById('catFilter').value.trim().replace(/\s+/g, '-').toLowerCase(),
  };
  if (id) {
    await db.collection('categories').doc(id).set(data, { merge: true });
  } else {
    await db.collection('categories').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  }
  closeModal('modalCat');
  await Promise.all([renderCategories(), renderDashboard(), refreshBienCatSelect()]);
});

async function editCat(id) {
  const cat = (await getCategories()).find(c => c.id === id);
  if (!cat) return;
  document.getElementById('modalCatTitle').textContent = 'Modifier la catégorie';
  document.getElementById('catId').value     = cat.id;
  document.getElementById('catIcon').value   = cat.icon;
  document.getElementById('catName').value   = cat.name;
  document.getElementById('catDesc').value   = cat.desc;
  document.getElementById('catFilter').value = cat.filter;
  openModal('modalCat');
};

function deleteCat(id) {
  document.getElementById('deleteMsg').textContent = `Supprimer cette catégorie ?`;
  document.getElementById('confirmDeleteBtn').onclick = async () => {
    await db.collection('categories').doc(id).delete();
    closeModal('modalDelete');
    await Promise.all([renderCategories(), renderDashboard()]);
  };
  openModal('modalDelete');
};

/* ══════════════════════════════════════════
   BIENS
══════════════════════════════════════════ */
async function renderBiens() {
  const biens = await getBiens();
  const cats  = await getCategories();
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
      <td data-label="Catégorie"><span class="badge-cat">${catLabel(b.categorie, cats)}</span></td>
      <td data-label="Localisation">${b.loc}</td>
      <td data-label="Prix"><span style="color:var(--gold);font-weight:600">${b.prix} ${b.prixUnit}</span></td>
      <td data-label="Actions">
        <div class="action-btns">
          <button class="btn-edit" data-action="edit-bien" data-id="${b.id}">✏️ Modifier</button>
          <button class="btn-del"  data-action="delete-bien" data-id="${b.id}">🗑 Supprimer</button>
        </div>
      </td>
    </tr>`).join('');
}

async function refreshBienCatSelect() {
  const sel  = document.getElementById('bienCategorie');
  const cats = await getCategories();
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

document.getElementById('bienForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id   = document.getElementById('bienId').value;
  const data = {
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
    await db.collection('biens').doc(id).set(data, { merge: true });
  } else {
    await db.collection('biens').add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  }
  closeModal('modalBien');
  await Promise.all([renderBiens(), renderDashboard()]);
});

async function editBien(id) {
  const b = (await getBiens()).find(b => b.id === id);
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
  await refreshBienCatSelect();
  document.getElementById('bienCategorie').value = b.categorie;
  document.getElementById('bienPrixUnit').value  = b.prixUnit;
  const img = document.getElementById('bienImgPreview');
  if (b.img) { img.src = b.img; img.style.display = 'block'; }
  else { img.style.display = 'none'; }
  openModal('modalBien');
};

function deleteBien(id) {
  document.getElementById('deleteMsg').textContent = `Supprimer ce bien ?`;
  document.getElementById('confirmDeleteBtn').onclick = async () => {
    await db.collection('biens').doc(id).delete();
    closeModal('modalDelete');
    await Promise.all([renderBiens(), renderDashboard()]);
  };
  openModal('modalDelete');
};

/* ══════════════════════════════════════════
   OFFRE EXCLUSIVE
══════════════════════════════════════════ */
async function loadOffreForm() {
  const o = await getOffre();
  if (!o) return;
  document.getElementById('offreTitre').value  = o.titre  || '';
  document.getElementById('offreTag').value    = o.tag    || '';
  document.getElementById('offreDesc').value   = o.desc   || '';
  document.getElementById('offreRemise').value = o.remise || '';
  document.getElementById('offreBadge').value  = o.badge  || '';
  document.getElementById('offreDate').value   = o.date   || '';
}

document.getElementById('offreForm').addEventListener('submit', async e => {
  e.preventDefault();
  await db.doc('config/offre').set({
    titre:  document.getElementById('offreTitre').value.trim(),
    tag:    document.getElementById('offreTag').value.trim(),
    desc:   document.getElementById('offreDesc').value.trim(),
    remise: document.getElementById('offreRemise').value.trim(),
    badge:  document.getElementById('offreBadge').value.trim(),
    date:   document.getElementById('offreDate').value,
  }, { merge: true });
  const saved = document.getElementById('offreSaved');
  saved.style.display = 'block';
  setTimeout(() => { saved.style.display = 'none'; }, 3000);
});

/* ══════════════════════════════════════════
   TIKTOK VIDEOS
══════════════════════════════════════════ */
async function renderTTVideos() {
  const videos = await getTTVideos();
  const list   = document.getElementById('ttVideoList');
  if (!videos.length) {
    list.innerHTML = '<p class="empty-tt">Aucune vidéo ajoutée. Collez une URL TikTok ci-dessus pour commencer.</p>';
    return;
  }
  list.innerHTML = videos.map((v, i) => {
    const videoId = (v.url.match(/\/video\/(\d+)/) || [])[1] || '—';
    return `
      <div class="tt-video-item" data-id="${v.id}">
        <div class="tt-order-btns">
          ${i > 0               ? `<button class="tt-order-btn" data-action="move-tt" data-id="${v.id}" data-dir="-1">▲</button>` : '<span class="tt-order-btn tt-order-disabled">▲</span>'}
          ${i < videos.length-1 ? `<button class="tt-order-btn" data-action="move-tt" data-id="${v.id}" data-dir="1">▼</button>` : '<span class="tt-order-btn tt-order-disabled">▼</span>'}
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
          <button class="btn-del" data-action="delete-tt" data-id="${v.id}">🗑</button>
        </div>
      </div>`;
  }).join('');
}

document.getElementById('ttAddForm').addEventListener('submit', async e => {
  e.preventDefault();
  const url      = document.getElementById('ttUrl').value.trim();
  const username = document.getElementById('ttUsername').value.trim() || 'hassane.immo';
  const desc     = document.getElementById('ttDesc').value.trim();
  if (!url) return;
  const existing = await getTTVideos();
  await db.collection('tiktok_videos').add({
    url, username, desc,
    order: existing.length,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  document.getElementById('ttAddForm').reset();
  document.getElementById('ttUsername').value = 'hassane.immo';
  renderTTVideos();
});

function deleteTTVideo(id) {
  document.getElementById('deleteMsg').textContent = 'Supprimer cette vidéo TikTok ?';
  document.getElementById('confirmDeleteBtn').onclick = async () => {
    await db.collection('tiktok_videos').doc(id).delete();
    closeModal('modalDelete');
    renderTTVideos();
  };
  openModal('modalDelete');
};

async function moveTTVideo(id, dir) {
  const videos = await getTTVideos();
  const idx    = videos.findIndex(v => v.id === id);
  if (idx < 0) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= videos.length) return;
  const batch = db.batch();
  batch.update(db.collection('tiktok_videos').doc(videos[idx].id), { order: newIdx });
  batch.update(db.collection('tiktok_videos').doc(videos[newIdx].id), { order: idx });
  await batch.commit();
  renderTTVideos();
};

/* ══════════════════════════════════════════
   SEED — initialiser les données par défaut si vide
══════════════════════════════════════════ */
async function seedIfEmpty() {
  const catSnap = await db.collection('categories').limit(1).get();
  if (!catSnap.empty) return;

  const batch = db.batch();
  DEFAULT_CATEGORIES.forEach(c => {
    const ref = db.collection('categories').doc();
    batch.set(ref, { ...c, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  });
  DEFAULT_BIENS.forEach(b => {
    const ref = db.collection('biens').doc();
    batch.set(ref, { ...b, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  });
  batch.set(db.doc('config/offre'), DEFAULT_OFFRE);
  await batch.commit();
}

/* ══════════════════════════════════════════
   EVENT DELEGATION
══════════════════════════════════════════ */
document.body.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const id     = btn.dataset.id;
  if (action === 'edit-cat')   editCat(id);
  if (action === 'delete-cat') deleteCat(id);
  if (action === 'edit-bien')  editBien(id);
  if (action === 'delete-bien') deleteBien(id);
  if (action === 'delete-tt')  deleteTTVideo(id);
  if (action === 'move-tt')    moveTTVideo(id, parseInt(btn.dataset.dir));
});

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
async function initAdmin() {
  await seedIfEmpty();
  await Promise.all([
    renderDashboard(),
    renderCategories(),
    renderBiens(),
    loadOffreForm(),
    refreshBienCatSelect(),
    renderTTVideos(),
  ]);
}
