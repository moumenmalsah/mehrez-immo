(function () {
  function extractVideoId(url) {
    url = url.trim();
    const m = url.match(/\/video\/(\d+)/);
    if (m) return m[1];
    if (/^\d{10,25}$/.test(url)) return url;
    return null;
  }

  function loadEmbedScript() {
    if (document.getElementById('tiktok-embed-js')) {
      try { if (window.tiktokEmbed?.lib?.render) window.tiktokEmbed.lib.render(); } catch {}
      return;
    }
    const s  = document.createElement('script');
    s.id     = 'tiktok-embed-js';
    s.src    = 'https://www.tiktok.com/embed.js';
    s.async  = true;
    document.body.appendChild(s);
  }

  async function render() {
    const loading = document.getElementById('tiktokLoading');
    const grid    = document.getElementById('tiktokGrid');
    const error   = document.getElementById('tiktokError');
    const follow  = document.getElementById('tiktokFollow');

    let videos = [];
    try {
      const snap = await db.collection('tiktok_videos').orderBy('createdAt').get();
      videos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch {
      try {
        videos = JSON.parse(localStorage.getItem('mi_tiktok_videos')) || [];
      } catch { videos = []; }
    }

    loading?.remove();

    if (!videos.length) {
      if (error)  error.style.display  = '';
      if (follow) follow.style.display = '';
      return;
    }

    if (grid) {
      grid.innerHTML = videos.map(v => {
        const id       = extractVideoId(v.url);
        const username = v.username || 'hassane.immo';
        const videoUrl = id
          ? `https://www.tiktok.com/@${username}/video/${id}`
          : v.url;

        return `
          <div class="tiktok-card">
            <div class="tiktok-embed-wrap">
              <blockquote
                class="tiktok-embed"
                cite="${videoUrl}"
                data-video-id="${id || ''}"
                style="max-width:100%;min-width:100%;">
                <section>
                  <a target="_blank" href="${videoUrl}">
                    ${v.desc || 'Vidéo TikTok @' + username}
                  </a>
                </section>
              </blockquote>
            </div>
          </div>`;
      }).join('');

      loadEmbedScript();
    }

    if (follow) follow.style.display = '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
