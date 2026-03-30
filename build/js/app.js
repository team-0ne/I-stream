/**
 * I-Stream — app.js
 * All home page logic: auth guard, navbar, hero,
 * genre filters, search, movie grid, detail modal,
 * and video player.
 */

'use strict';

// ── Auth Guard ───────────────────────────────────────────

const SESSION = JSON.parse(localStorage.getItem('is_session') || 'null');
if (!SESSION) {
  window.location.href = 'login.html';
}

// ── Populate user UI ─────────────────────────────────────

document.getElementById('nav-avatar').textContent = SESSION.name[0].toUpperCase();
document.getElementById('nav-name').textContent = SESSION.name;
document.getElementById('drop-name').textContent = SESSION.name;
document.getElementById('drop-email').textContent = SESSION.guest ? 'Browsing as guest' : SESSION.email;

// ── Sign out ─────────────────────────────────────────────

function signOut() {
  localStorage.removeItem('is_session');
  window.location.href = 'login.html';
}

document.getElementById('btn-signout').addEventListener('click', signOut);

// ── User dropdown ────────────────────────────────────────

document.getElementById('user-btn').addEventListener('click', () => {
  document.getElementById('user-drop').classList.toggle('hidden');
});

document.addEventListener('click', e => {
  const drop = document.getElementById('user-drop');
  const btn  = document.getElementById('user-btn');
  if (!drop.contains(e.target) && !btn.contains(e.target)) {
    drop.classList.add('hidden');
  }
});

// ── Navbar scroll effect ─────────────────────────────────

window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nb.style.background    = 'rgba(5,7,26,0.95)';
    nb.style.backdropFilter = 'blur(20px)';
    nb.style.borderBottom  = '1px solid rgba(255,255,255,0.05)';
  } else {
    nb.style.background    = 'transparent';
    nb.style.backdropFilter = 'none';
    nb.style.borderBottom  = 'none';
  }
}, { passive: true });

// ── Mobile search toggle ─────────────────────────────────

document.getElementById('mobile-search-btn').addEventListener('click', () => {
  document.getElementById('mobile-search').classList.toggle('hidden');
});

// ── State ────────────────────────────────────────────────

let activeGenre = 'All';
let searchQuery = '';

// ── Genre pills ──────────────────────────────────────────

function buildGenrePills() {
  const genres = ['All', ...new Set(MOVIES.flatMap(m => m.genre))].sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    return a.localeCompare(b);
  });

  const pillHTML = genres.map(g => `
    <button data-genre="${g}" class="genre-pill flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-600 transition-all ${g === 'All' ? 'active-pill' : 'inactive-pill'}">
      ${g}
    </button>
  `).join('');

  document.getElementById('genre-nav').innerHTML    = pillHTML;
  document.getElementById('genre-mobile').innerHTML = pillHTML;

  document.querySelectorAll('.genre-pill').forEach(pill => {
    pill.addEventListener('click', () => setGenre(pill.dataset.genre));
  });
}

function setGenre(genre) {
  activeGenre = genre;
  document.querySelectorAll('.genre-pill').forEach(pill => {
    pill.className = `genre-pill flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-600 transition-all ${pill.dataset.genre === genre ? 'active-pill' : 'inactive-pill'}`;
  });
  renderGrid();
}

// ── Search ───────────────────────────────────────────────

function onSearch(value) {
  searchQuery = value.trim();
  renderGrid();
}

function clearSearch() {
  searchQuery = '';
  document.querySelectorAll('#search-inp, #search-mobile').forEach(inp => { inp.value = ''; });
  renderGrid();
}

function resetFilters() {
  activeGenre = 'All';
  clearSearch();
  buildGenrePills();
}

document.getElementById('search-inp').addEventListener('input', e => onSearch(e.target.value));
document.getElementById('search-mobile').addEventListener('input', e => onSearch(e.target.value));
document.getElementById('btn-clear-search').addEventListener('click', clearSearch);
document.getElementById('btn-reset').addEventListener('click', resetFilters);
document.getElementById('sort-sel').addEventListener('change', renderGrid);

// ── Movie card HTML ──────────────────────────────────────

function movieCard(movie) {
  const hasVideo = movie.src && movie.src.trim() !== '';

  return `
    <div class="card group cursor-pointer rounded-2xl overflow-hidden" data-id="${movie.id}">
      <div class="relative" style="aspect-ratio:2/3">
        <img
          src="${movie.poster || ''}"
          alt="${movie.title}"
          class="w-full h-full object-cover bg-navy-800 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
        />
        <div class="hidden absolute inset-0 bg-navy-700 items-center justify-center text-3xl">🎬</div>

        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center" style="background:rgba(3,7,18,0.6)">
          <button class="btn-card-play cta-btn w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${!hasVideo ? 'opacity-40 cursor-not-allowed' : ''}" data-id="${movie.id}">
            <svg class="w-5 h-5 ml-0.5 text-navy-900" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>

        ${movie.rating ? `<div class="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[11px] font-700" style="background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);color:#67E8F9">★ ${movie.rating}</div>` : ''}
        ${movie.year   ? `<div class="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] text-white/40" style="background:rgba(5,7,26,0.7)">${movie.year}</div>` : ''}
        ${!hasVideo    ? `<div class="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg text-[9px] text-white/25 font-600 uppercase tracking-wider" style="background:rgba(5,7,26,0.8)">No Source</div>` : ''}
      </div>
      <div class="p-2.5">
        <p class="text-white text-xs font-600 truncate">${movie.title}</p>
        <p class="text-white/30 text-[10px] truncate mt-0.5">${movie.genre.join(' · ')}</p>
      </div>
    </div>
  `;
}

// ── Render grid ──────────────────────────────────────────

function renderGrid() {
  let list = [...MOVIES];

  if (activeGenre !== 'All') {
    list = list.filter(m => m.genre.includes(activeGenre));
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.genre.some(g => g.toLowerCase().includes(q)) ||
      (m.director || '').toLowerCase().includes(q) ||
      (m.cast || []).some(c => c.toLowerCase().includes(q))
    );
  }

  const sort = document.getElementById('sort-sel').value;
  if (sort === 'az')     list.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === 'year')   list.sort((a, b) => (b.year || 0) - (a.year || 0));

  const grid   = document.getElementById('movie-grid');
  const empty  = document.getElementById('empty-state');
  const banner = document.getElementById('search-banner');

  document.getElementById('section-title').textContent = activeGenre === 'All' ? 'All Movies' : activeGenre;
  document.getElementById('section-count').textContent = `${list.length} ${list.length === 1 ? 'title' : 'titles'}`;

  if (searchQuery) {
    banner.classList.remove('hidden');
    banner.style.display = 'flex';
    document.getElementById('search-label').textContent = `"${searchQuery}"`;
  } else {
    banner.classList.add('hidden');
  }

  if (!list.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  grid.innerHTML = list.map(movieCard).join('');

  // Attach card click events
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openDetail(Number(card.dataset.id)));
  });

  grid.querySelectorAll('.btn-card-play').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      playMovie(Number(btn.dataset.id));
    });
  });
}

// ── Hero ─────────────────────────────────────────────────

function renderHero() {
  const featured = MOVIES.filter(m => m.featured);
  if (!featured.length) return;

  const m = featured[0];
  document.getElementById('hero-bg').style.backgroundImage = `url('${m.backdrop || m.poster || ''}')`;
  document.getElementById('hero-title').textContent = m.title;
  document.getElementById('hero-desc').textContent  = m.desc || '';
  document.getElementById('hero-meta').innerHTML = [
    m.rating ? `<span class="px-2.5 py-0.5 rounded-lg text-[11px] font-700 text-cyan" style="background:rgba(6,182,212,0.12);border:1px solid rgba(6,182,212,0.25)">★ ${m.rating}</span>` : '',
    m.year   ? `<span class="text-white/35 text-sm">${m.year}</span>` : '',
    m.dur    ? `<span class="text-white/25">·</span><span class="text-white/35 text-sm">${m.dur}</span>` : '',
    m.genre?.length ? `<span class="text-white/25">·</span><span class="text-white/35 text-sm">${m.genre.join(' / ')}</span>` : ''
  ].filter(Boolean).join('');

  document.getElementById('hero-play-btn').addEventListener('click', () => playMovie(m.id));
  document.getElementById('hero-info-btn').addEventListener('click', () => openDetail(m.id));
}

// ── Detail modal ─────────────────────────────────────────

function openDetail(id) {
  const m = MOVIES.find(x => x.id === id);
  if (!m) return;

  document.getElementById('detail-backdrop').src    = m.backdrop || m.poster || '';
  document.getElementById('detail-poster').src      = m.poster || '';
  document.getElementById('detail-title').textContent     = m.title;
  document.getElementById('detail-desc').textContent      = m.desc || '';
  document.getElementById('detail-director').textContent  = m.director || '—';
  document.getElementById('detail-cast').textContent      = (m.cast || []).join(', ') || '—';
  document.getElementById('detail-genre').textContent     = (m.genre || []).join(', ') || '—';
  document.getElementById('detail-dur').textContent       = m.dur || '—';
  document.getElementById('detail-meta').innerHTML = [
    m.rating ? `<span class="text-cyan font-700">★ ${m.rating}</span>` : '',
    m.year   ? `<span class="text-white/30">${m.year}</span>` : ''
  ].filter(Boolean).join('<span class="text-white/15 mx-1">·</span>');

  document.getElementById('detail-play-btn').onclick = () => { closeDetail(); playMovie(id); };
  document.getElementById('detail-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  document.getElementById('detail-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

document.getElementById('btn-close-detail').addEventListener('click', closeDetail);
document.getElementById('detail-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeDetail();
});

// ── Player ───────────────────────────────────────────────

let hideControlsTimer = null;

function playMovie(id) {
  const m = MOVIES.find(x => x.id === id);
  if (!m) return;

  const vid    = document.getElementById('video-el');
  const src    = document.getElementById('video-src');
  const noSrc  = document.getElementById('no-src-msg');

  document.getElementById('modal-title').textContent = m.title;
  document.getElementById('modal-meta').textContent  =
    [m.year, m.dur, (m.genre || []).join(' / ')].filter(Boolean).join(' · ');

  if (m.src && m.src.trim()) {
    noSrc.classList.add('hidden');
    vid.style.display = '';
    src.src = m.src;
    vid.load();
    vid.volume = 0.8;
    document.getElementById('vol-bar').value = 80;
    vid.play().catch(() => {});
    setPPIcon(true);
  } else {
    vid.style.display = 'none';
    noSrc.classList.remove('hidden');
  }

  document.getElementById('player-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  showControls();
}

function closePlayer() {
  const vid = document.getElementById('video-el');
  vid.pause();
  vid.src = '';
  document.getElementById('video-src').src = '';
  document.getElementById('player-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

document.getElementById('btn-close-player').addEventListener('click', closePlayer);
document.getElementById('player-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closePlayer();
});

// Controls visibility
function showControls() {
  document.getElementById('video-controls').style.opacity = '1';
  clearTimeout(hideControlsTimer);
  hideControlsTimer = setTimeout(() => {
    document.getElementById('video-controls').style.opacity = '0';
  }, 3000);
}

document.getElementById('video-wrapper').addEventListener('mousemove', showControls);
document.getElementById('video-wrapper').addEventListener('mouseleave', () => {
  document.getElementById('video-controls').style.opacity = '0';
});
document.getElementById('video-wrapper').addEventListener('touchstart', showControls, { passive: true });

// Play / pause
function togglePP() {
  const vid = document.getElementById('video-el');
  if (vid.paused) { vid.play(); setPPIcon(true);  flashIndicator(true); }
  else            { vid.pause(); setPPIcon(false); flashIndicator(false); }
  showControls();
}

function setPPIcon(playing) {
  const d = playing ? 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' : 'M8 5v14l11-7z';
  document.getElementById('pp-path').setAttribute('d', d);
}

function flashIndicator(playing) {
  const flash = document.getElementById('pp-flash');
  document.getElementById('pp-flash-path').setAttribute('d',
    playing ? 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' : 'M8 5v14l11-7z'
  );
  flash.style.opacity   = '1';
  flash.style.transform = 'scale(1)';
  setTimeout(() => {
    flash.style.opacity   = '0';
    flash.style.transform = 'scale(.6)';
  }, 600);
}

document.getElementById('video-el').addEventListener('click', togglePP);
document.getElementById('btn-pp').addEventListener('click', togglePP);

// Progress bar
document.getElementById('video-el').addEventListener('timeupdate', () => {
  const vid = document.getElementById('video-el');
  if (!vid.duration) return;
  const pct = (vid.currentTime / vid.duration) * 100;
  document.getElementById('prog-bar').value      = pct;
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('cur-time').textContent = formatTime(vid.currentTime);
  document.getElementById('dur-time').textContent = formatTime(vid.duration);
});

document.getElementById('prog-bar').addEventListener('input', function () {
  const vid = document.getElementById('video-el');
  if (vid.duration) vid.currentTime = (this.value / 100) * vid.duration;
});

// Skip
function skip(seconds) {
  const vid = document.getElementById('video-el');
  vid.currentTime = Math.max(0, Math.min(vid.duration || 0, vid.currentTime + seconds));
  showControls();
}
document.getElementById('btn-skip-back').addEventListener('click', () => skip(-10));
document.getElementById('btn-skip-fwd').addEventListener('click',  () => skip(10));

// Mute
document.getElementById('btn-mute').addEventListener('click', () => {
  const vid = document.getElementById('video-el');
  vid.muted = !vid.muted;
  document.getElementById('btn-mute').style.opacity = vid.muted ? '0.3' : '1';
});

// Volume
document.getElementById('vol-bar').addEventListener('input', function () {
  document.getElementById('video-el').volume = this.value / 100;
});

// Fullscreen
function requestFullscreen() {
  const wrapper = document.getElementById('video-wrapper');
  if (!document.fullscreenElement) {
    wrapper.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
}
document.getElementById('btn-full-top').addEventListener('click', requestFullscreen);
document.getElementById('btn-full-bottom').addEventListener('click', requestFullscreen);

// Format time helper
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
}

// ── Keyboard shortcuts (player only) ────────────────────

document.addEventListener('keydown', e => {
  const playerOpen = !document.getElementById('player-modal').classList.contains('hidden');
  const detailOpen = !document.getElementById('detail-modal').classList.contains('hidden');

  if (playerOpen) {
    if (e.key === 'Escape')      closePlayer();
    if (e.key === ' ')           { e.preventDefault(); togglePP(); }
    if (e.key === 'ArrowRight')  skip(10);
    if (e.key === 'ArrowLeft')   skip(-10);
    if (e.key === 'ArrowUp')     { const v = document.getElementById('video-el'); v.volume = Math.min(1, v.volume + 0.1); }
    if (e.key === 'ArrowDown')   { const v = document.getElementById('video-el'); v.volume = Math.max(0, v.volume - 0.1); }
    if (e.key === 'f' || e.key === 'F') requestFullscreen();
  }

  if (detailOpen && e.key === 'Escape') closeDetail();
});



buildGenrePills();
renderHero();
renderGrid();